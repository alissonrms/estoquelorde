const connection = require('../database/connection');
const cryptography = require('./cryptography');


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
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    const full_date = year + "-" + month + "-" + day + " " 
    + hours + ":" + minutes + ":" + seconds;
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection('selling').insert({
            'date': full_date,
            'id_user': id_user,
            'id_reseller': id_reseller
        });
        const result = await connection('selling')
        .where('id_user', id_user)
        .andWhere('date', full_date)
        .select('id')
        .first();
        
        for (const key in products) {     
            await connection('selling_product').insert({
                'quantity': products[key].quantity,
                'price': products[key].price,
                'id_user': id_user,
                'id_product': products[key].id_product,
                'id_selling': result.id
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
    const {id_user, id_selling, } = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !id_selling){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('selling')
            .join('selling_product', 'selling.id', '=', 'selling_product.id_selling')
            .where('selling.id_user', id_user)
            .andWhere('selling.id', id_selling)
            .select('selling_product.id_product', 'selling_product.quantity', 'selling_product.id');
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
            await connection("selling_product")
                .where("id", result[key].id)
                .andWhere('id_user', id_user)
                .delete();
        }

        await connection("selling")
            .where("id", id_selling)
            .andWhere('id_user', id_user)
            .delete();

        return response.status(204).send();

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }

  },

  async list(request, response){
    const {id_user} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection("selling_product")
            .join("selling", "selling.id", "=", "selling_product.id_selling")
            .join('product', 'product.id', '=', 'selling_product.id_product')
            .join('reseller', 'reseller.id', '=', 'selling.id_reseller')
            .where("selling.id_user", id_user)
            .select('selling.id', 'selling.date', 'reseller.name',
             'product.name', 'selling_product.quantity', 'selling_product.price',
              'selling_product.id as id_selling_product', 'selling_product.id_product as id_product');
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const {id_user, id_reseller, id_selling} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !id_selling
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
        await connection('selling')
            .where('id_user', id_user)
            .andWhere('id', id_selling)
            .update({
                'id_reseller': id_reseller,
            });
       
        return response.status(200).json({status: "Atualização realizada com sucesso"});

    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }
  }

}