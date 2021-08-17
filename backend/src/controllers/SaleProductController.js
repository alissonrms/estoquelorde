const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');


module.exports = {
  async update(request, response){
    const { id_sale_products, quantity, id_product} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;
    
    if(!id_user || !token || !id_sale_products 
        || !quantity || !(quantity > 0)
        || Math.floor(quantity) != quantity){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var product = await connection('product')
            .where('id_user', id_user)
            .andWhere('id', id_product)
            .select('stock', 'id')
            .first();
        if( product.stock < quantity){
            return response.status(400).json({status: "Atualização impossível"});
        }

        const sale_product = await connection("sale_product")
        .where("id_user", id_user)
        .andWhere('id', id_sale_products)
        .select("quantity", 'id_product')
        .first();
        product = await connection('product')
            .where('id_user', id_user)
            .andWhere('id', sale_product.id_product)
            .select('stock', 'id')
            .first();

        await connection('product')
            .where('id_user', id_user)
            .andWhere('id', sale_product.id_product)
            .update({
                'stock': product.stock + sale_product.quantity
                
            });

        await connection('sale_product')
            .where('id_user', id_user)
            .andWhere('id', id_sale_products)
            .update({
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