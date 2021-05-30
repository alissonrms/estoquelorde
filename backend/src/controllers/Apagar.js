const connection = require('../database/connection');


module.exports = {
  async allUsers(request, response){

    const result = await connection('selling')
    .select();

    return response.json(result);
  }


}