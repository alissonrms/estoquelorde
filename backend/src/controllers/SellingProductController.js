const connection = require('../database/connection');
const cryptography = require('./cryptography');


module.exports = {
  async update(request, response){
    const {id_user, id_selling_products, price, quantity, id_product} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !id_selling_products 
        || !price || !quantity || !id_product
        || !(price > 0) || !(quantity > 0)
        || Math.floor(quantity) != quantity){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const selling_product = await connection("selling_product")
        .where("id_user", id_user)
        .andWhere('id', id_selling_products)
        .select("quantity", 'id_product')
        .first();
        var product = await connection('product')
            .where('id_user', id_user)
            .andWhere('id', selling_product.id_product)
            .select('stock', 'id')
            .first();
        const stockOld = product.stock;

        await connection('product')
            .where('id_user', id_user)
            .andWhere('id', selling_product.id_product)
            .update({
                'stock': product.stock + selling_product.quantity
                
            });

        product = await connection('product')
            .where('id_user', id_user)
            .andWhere('id', id_product)
            .select('stock', 'id')
            .first();
        if( product.stock < quantity){
            await connection('product')
            .where('id_user', id_user)
            .andWhere('id', selling_product.id_product)
            .update({
                'stock': stockOld
                
            });
            return response.status(400).json({status: "Atualização impossível"});
        }

        await connection('selling_product')
            .where('id_user', id_user)
            .andWhere('id', id_selling_products)
            .update({
                'price': price,
                'quantity': quantity,
                'id_product': id_product
                
            });
        await connection('product')
            .where('id_user', id_user)
            .andWhere('id', id_product)
            .update({
                'stock': product.stock - quantity,
            });
       
        return response.status(200).json({status: "Atualização realizada com sucesso"});

    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }
  }

}