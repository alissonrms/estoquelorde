const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');

module.exports = {
  async login(request, response){
    const {username, password} = request.body;

    const result = await connection('user')
    .where('username', username)
    .select('id','password', 'salt')
    .first();

    if(!result){
      return response.status(400).json({error: "Usuário ou senha incorretos"});
    }

    const validation = await cryptography.validate(
      password,
       result.password,
        result.salt);

    if(!validation){
      return response.status(400).json({error: "Usuário ou senha incorretos"});
    }
    var salt = await cryptography.generateSalt();
    var id = result.id;

    await connection('user').where('id', id).update({
      "salt_session": salt
    });
    id = id.toString();

    var id_encrypted = await cryptography.sha512(id, salt);
    const token = id_encrypted.hash;


    return response.json({id, token});
  },


  
  async logout(request, response){
    
    const  id_user = request.headers.id_user;
    await connection('user').where('id', id_user).update({
      "salt_session": null
    });
    return response.status(200).json({status: "Logout efetuado com sucesso"});


  }


}