const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async values(request, response){
    const {id_user, datepast, today} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){

        const expense = await connection("expense")
            .whereBetween('date', [datepast, today])
            .andWhere('id_user', id_user)
            .sum('price_expense as sum');
        
        const entry_product = await connection('entry_product')
            .whereBetween('date', [datepast, today])
            .andWhere('id_user', id_user)
            .select('price_entry', 'quantity');

        var total_entry_product = 0;
        for(const key in entry_product){
            total_entry_product += entry_product[key].price_entry * entry_product[key].quantity;
        }

        const sale = await connection('sale_product')
            .join('sale', 'sale.id', '=', 'sale_product.id_sale')
            .whereBetween('sale.date', [datepast, today])
            .andWhere('sale_product.id_user', id_user)
            .select('sale_product.price', 'sale_product.quantity');

        var total_sale = 0;
        for(const key in sale){
            total_sale += sale[key].price * sale[key].quantity;
        }

        return response.json({
            "expense": expense[0].sum,
            "entry_product": total_entry_product,
            "sale": total_sale
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