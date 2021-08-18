const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async values(request, response){
    const { datepast, today} = request.query;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!await functions.validateDates(datepast, today)){
        return response.status(400).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){

        const expense = await connection("expense")
            .where('id_user', id_user)
            .whereBetween('date', [datepast, today])
            .sum('price_expense as sum');
        
        const entry_product = await connection('entry_product')
            .where('id_user', id_user)
            .whereBetween('date', [datepast, today])
            .sum('price_entry as sum');

        const sale = await connection("sale")
            .where('id_user', id_user)
            .whereBetween('date', [datepast, today])
            .orWhereBetween('pay_date', [datepast, today])
            .andWhere('id_user', id_user)
            .select('price', 'commission', 'paid', 'pay_date');

        const values = await functions.calcSaleValues(sale, datepast, today);

        return response.json({
            "expense": expense[0].sum,
            "entry_product": entry_product[0].sum,
            "sale": values.profit,
            "commission": values.commission,
            "pending:": values.pending
        });
        
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async list(request, response){
    const {page} = request.query;

    if(!page || !(page > 0) || Math.floor(page) != page){
        return response.status(401).json({status: "Operação não permitida"});
    }

    const respost = await functions.queryListStatement(request ,response, (5 * (page - 1)), 5);

    return respost;
  }

}