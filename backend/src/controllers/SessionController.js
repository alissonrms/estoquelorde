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

    if(validation){
      var salt = await cryptography.generateSalt();
      var id = result.id;

      await connection('user').where('id', id).update({
        "salt_session": salt
      });
      id = id.toString();

      var id_encrypted = await cryptography.sha512(id, salt);
      const token = id_encrypted.hash;


      return response.json({id, token});
    }else{
      return response.status(400).json({error: "Usuário ou senha incorretos"});
    }
  },


  
  async logout(request, response){
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    const authentication = await cryptography.authenticate(id_user, token);
    if(authentication){
      await connection('user').where('id', id_user).update({
        "salt_session": null
      });
      return response.status(200).json({status: "Logout efetuado com sucesso"});
    }

    return response.status(403).json({status: "Logout imposível"});

  }


}