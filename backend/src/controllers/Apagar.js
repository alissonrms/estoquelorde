const connection = require('../database/connection');


module.exports = {
  async allUsers(request, response){

    const result = await connection('user')
    .select();

    return response.json(result);
  }


}