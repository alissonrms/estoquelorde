const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async product(request, response){
    const {id_user, datepast, today} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var respost = [];
        const products = await connection('product').where('id_user', id_user).select('id', 'name');
        for(const key in products){
            var profit = 0;
            var units = 0;
            const result = await connection('sale_product')
                .join('sale', 'sale_product.id_sale', '=', 'sale.id')
                .where('sale_product.id_product', products[key].id )
                .andWhere('sale_product.id_user', id_user)
                .whereBetween('sale.date', [datepast, today])
                .select('sale_product.quantity', 'sale_product.price');
            for(const key in result){
                profit += (result[key].quantity * result[key].price);
                units += result[key].quantity;
            }
            
            const product = {
                "name": products[key].name,
                "units": units,
                "profit": profit
            }
            respost = respost.concat(product);
        }
        
        return response.json(respost);
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async reseller(request, response){
    const {id_user, datepast, today} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var respost = [];
        const resellers = await connection('reseller').where('id_user', id_user).select('id', 'name');
        for(const key in resellers){
            var profit = 0;
            var sales = 0;
            var prejudice = 0;
            const expense = await connection('expense')
                .where('id_reseller', resellers[key].id )
                .andWhere('id_user', id_user)
                .whereBetween('date', [datepast, today])
                .select('price_expense');

            const sale = await connection('sale_product')
                .join('sale', 'sale.id', 'sale_product.id_sale')
                .where('sale.id_reseller', resellers[key].id)
                .andWhere('id_user', id_user)
                .whereBetween('sale.date', [datepast, today])
                .select('sale_product.quantity', 'sale_product.price');
            for(const key in expense){
                prejudice += expense[key].price_expense;
            }
            for(const key in sale){
                sales += 1;
                profit += (sale[key].quantity * sale[key].price);
            }
            
            const reseller = {
                "name": resellers[key].name,
                "sales": sales,
                "profit": profit,
                "prejudice": prejudice
            }
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