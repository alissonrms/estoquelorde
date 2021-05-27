const connection = require('../database/connection');
const cryptography = require('./cryptography');

module.exports = {
  async create(request, response){
    const {username, password} = request.body;

    const result = await connection('user')
    .where('username', username)
    .select('username')
    .first();

    if(result){
        return response.status(406).json({error: "Usuário "+username+" já está cadastrado"});
    }

    var salt = await cryptography.generateSalt();
    
    var password_encrypted = await cryptography.sha512(password, salt);
    password_encrypted = password_encrypted.hash;

    await connection('user').insert({
        "password": password_encrypted,
        "username": username,
        "salt": salt,
        "salt_session": null
    });

    return response.json({username});
  }


}