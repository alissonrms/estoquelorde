const connection = require('../database/connection');



module.exports = {
  async allUsers(request, response){

    const sale = await connection('sale')
            .select('*');

    return response.status(200).json(sale)

  }


}