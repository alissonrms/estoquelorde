const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async product(request, response){
    const {datepast, today} = request.query;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var respost = [];
        const products = await connection('product').where('id_user', id_user).select('id', 'name');
        for(const key in products){
            var units = 0;
            const result = await connection('sale_product')
                .join('sale', 'sale_product.id_sale', '=', 'sale.id')
                .where('sale_product.id_product', products[key].id )
                .andWhere('sale_product.id_user', id_user)
                .whereBetween('sale.date', [datepast, today])
                .select('sale_product.quantity');
            for(const key in result){
                units += result[key].quantity;
            }
            
            const product = {
                "name": products[key].name,
                "units": units
            }
            respost = respost.concat(product);
        }
        
        return response.json(respost);
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async reseller(request, response){
    const { datepast, today} = request.query;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var respost = [];
        const resellers = await connection('reseller').where('id_user', id_user).select('id', 'name');
        for(const key in resellers){
            var prejudice = 0;
            const expense = await connection('expense')
                .where('id_reseller', resellers[key].id )
                .andWhere('id_user', id_user)
                .whereBetween('date', [datepast, today])
                .select('price_expense');

            const sale = await connection('sale')
                .where('id_reseller', resellers[key].id)
                .andWhere('id_user', id_user)
                .whereBetween('date', [datepast, today])
                .select('price', 'commission', 'paid', 'pay_date');
            for(const key in expense){
                prejudice += expense[key].price_expense;
            }
            const values = await functions.calcSaleValues(sale, datepast, today);
            
            const reseller = {
                "name": resellers[key].name,
                "sales": values.sales,
                "profit": values.profit,
                "prejudice": prejudice,
                "commission": values.commission
            };
            respost = respost.concat(reseller);
        }
        
        return response.json(respost);
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async list(request, response){

    const respost = await functions.queryListStatement(request ,response, 0, 'ALL');

    return respost;
  }
}