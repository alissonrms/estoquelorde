const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');


module.exports = {
    
  async create(request, response){
    const {id_user, id_reseller, products} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !id_reseller 
        || !products){
        return response.status(400).json({status: "Venda impossível"});
    }
    for (const key in products) {
        const query = await connection('product')
            .where('id', products[key].id_product)
            .andWhere('id_user', id_user)
            .select('stock')
            .first();
            
        if(!(products[key]).quantity || !(products[key]).price || !(products[key]).id_product
            || !((products[key]).quantity > 0) || !((products[key]).price > 0)
            || Math.floor((products[key]).quantity) != (products[key]).quantity
            || (products[key]).quantity > query.stock
            ){
            return response.status(400).json({status: "Venda impossível"});
        }
        
    }

    const date = new Date();
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection('sale').insert({
            'date': date,
            'id_user': id_user,
            'id_reseller': id_reseller
        });
        const result = await connection('sale')
        .where('id_user', id_user)
        .andWhere('date', date)
        .select('id')
        .first();
        
        for (const key in products) {     
            await connection('sale_product').insert({
                'quantity': products[key].quantity,
                'price': products[key].price,
                'id_user': id_user,
                'id_product': products[key].id_product,
                'id_sale': result.id
            });
            const queryStock = await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .select('stock')
                .first();
            const newStock = parseInt(queryStock.stock) - parseInt(products[key].quantity);
            await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .update({
                    'stock': newStock
                });
        }
        
       
        return response.status(200).json({status: "Venda realizada com sucesso"});

    }else{
        return response.status(401).json({status: "Venda impossível"});
    }

  },

  async delete(request, response){
    const {id_user, id_sale, } = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !id_sale){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('sale')
            .join('sale_product', 'sale.id', '=', 'sale_product.id_sale')
            .where('sale.id_user', id_user)
            .andWhere('sale.id', id_sale)
            .select('sale_product.id_product', 'sale_product.quantity', 'sale_product.id');
        for(const key in result){
            const resultB = await connection('product')
                .where('id', result[key].id_product)
                .select('stock')
                .first();
            const stock = result[key].quantity + resultB.stock;
            await connection('product')
                .where('id', result[key].id_product)
                .update({
                    'stock': stock
                });
            await connection("sale_product")
                .where("id", result[key].id)
                .andWhere('id_user', id_user)
                .delete();
        }

        await connection("sale")
            .where("id", id_sale)
            .andWhere('id_user', id_user)
            .delete();

        return response.status(204).send();

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }

  },

  async update(request, response){
    const {id_user, id_reseller, id_sale} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !id_sale
        || !id_reseller){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const reseller = await connection("reseller")
        .where("id_user", id_user)
        .andWhere('id', id_reseller)
        .select('name')
        .first();
        if(!reseller){
            return response.status(400).json({status: "Atualização impossível"});
        }
        await connection('sale')
            .where('id_user', id_user)
            .andWhere('id', id_sale)
            .update({
                'id_reseller': id_reseller,
            });
       
        return response.status(200).json({status: "Atualização realizada com sucesso"});

    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }
  }

}