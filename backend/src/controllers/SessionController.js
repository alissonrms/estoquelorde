const connection = require('../database/connection');
const cryptography = require('./cryptography');

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

      var id_criptografado = await cryptography.sha512(id, salt);
      const token = id_criptografado.hash;


      return response.json({id, token});
    }else{
      return response.status(400).json({error: "Usuário ou senha incorretos"});
    }
  },

  async logout(request, response){
    const {id} = request.body;
    const token = request.headers.authorization;

    const authentication = await cryptography.authenticate(id, token);
    if(authentication){
      await connection('user').where('id', id).update({
        "salt_session": null
      });
    }

    return response.status(200);

  }


}