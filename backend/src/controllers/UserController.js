const connection = require('../database/connection');
const cryptography = require('./cryptography');

module.exports = {
  async create(request, response){
    const {username, password} = request.body;

    const resultado = await connection('user')
    .where('username', username)
    .select('username')
    .first();

    if(resultado){
        return response.status(406).json({error: "User "+username+" has already been created"});
    }

    var salt = await cryptography.generateSalt();
    
    var password_criptografada = await cryptography.sha512(password, salt);
    password_criptografada = password_criptografada.hash;

    await connection('user').insert({
        "password": password_criptografada,
        "username": username,
        "salt": salt,
        "salt_session": null
    });

    return response.json({username});
  }


}