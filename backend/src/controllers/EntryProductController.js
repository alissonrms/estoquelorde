const connection = require('../database/connection');

module.exports = {
  async  create(request, response){
    const { id_product, price_entry, stock_product} = request.body;
 
    const id_user = request.headers.id_user;
    
    if(!id_user || !id_product 
        || !(price_entry > 0) || !(stock_product > 0)
        || Math.floor(stock_product) != stock_product){
        return response.status(400).json({status: "Cadastro impossível"});
    }

    const date = new Date();
        
    const result = await connection("product")
    .where("id", id_product)
    .andWhere('id_user', id_user)
    .andWhere('activated', true)
    .select("stock")
    .first();

    if(!result){
        return response.status(400).json({status: "Produto não encontrado!"});
    }
    
    const stock = parseInt(result.stock) + parseInt(stock_product);

    await connection('entry_product').insert({
        "date": date,
        "price_entry": price_entry,
        "id_product": id_product,
        "id_user": id_user,
        "quantity": stock_product
    });

    await connection("product")
    .where("id", id_product)
    .andWhere('id_user', id_user)
    .update({
        "stock": stock
    });

    return response.status(200).json({status: "Cadastrado com sucesso"});



  },

  async delete(request, response){
    const { entry_product_id } = request.params;
    
    const id_user = request.headers.id_user;

    if(!id_user || !entry_product_id){
        return response.status(400).json({status: "Operação não permitida"});
    }
    const resultA = await connection('entry_product')
        .where('id', entry_product_id)
        .andWhere('id_user', id_user)
        .select('quantity', 'id_product')
        .first();
    const resultB = await connection('product')
        .where('id', resultA.id_product)
        .andWhere('id_user', id_user)
        .select('stock')
        .first();
    const stock = parseInt(resultB.stock) - parseInt(resultA.quantity);
    if(stock < 0){
        return response.status(400).json({status: "Estoque insuficiente para realizar esta ação"});
    }
    await connection('product')
        .where("id", resultA.id_product)
        .andWhere('id_user', id_user)
        .update({
            "stock": stock
        });

    await connection("entry_product")
    .where("id", entry_product_id)
    .andWhere('id_user', id_user)
    .delete();

    return response.status(204).send();
  },

  async update(request, response){
    const { id_product, price_entry, stock_product, id_entry_product} = request.body;
    
    const id_user = request.headers.id_user;

    if(!id_user || !id_product 
        || !(price_entry > 0) || !(stock_product > 0)
        || Math.floor(stock_product) != stock_product
        || !id_entry_product){
        return response.status(400).json({status: "Atualização impossível"});
    }

    const resultA = await connection('entry_product')
        .where('id', id_entry_product)
        .andWhere('id_user', id_user)
        .select('quantity', 'id_product')
        .first();
    const resultB = await connection('product')
        .where('id', id_product)
        .andWhere('id_user', id_user)
        .select('stock', 'id')
        .first();
    const resultC = await connection('product')
        .where('id', resultA.id_product)
        .andWhere('id_user', id_user)
        .select('stock', 'id')
        .first();

    if(!resultA || !resultB || !resultC){
        return response.status(406).json({status: "Produto não encontrado"});
    }

    if(resultB.id == resultC.id){
        var stockA = parseInt(resultB.stock) + parseInt(stock_product) - parseInt(resultA.quantity);
        if(stockA < 0){
            return response.status(400).json({status: "Estoque insuficiente para realizar esta ação"});
        }
        await connection('product')
        .where("id", id_product)
        .update({
            "stock": stockA
        });
    }else{
        var stockB = parseInt(resultB.stock) + parseInt(stock_product);
        var stockA = parseInt(resultC.stock) - parseInt(resultA.quantity);

        if(stockA < 0){
            return response.status(401).json({status: "Estoque insuficiente para realizar esta ação"});
        }
        await connection('product')
        .where("id", id_product)
        .update({
            "stock": stockB
        });
        await connection('product')
        .where("id", resultA.id_product)
        .update({
            "stock": stockA
        });
    }
    

    await connection('entry_product')
    .where("id", id_entry_product)
    .update({
        "price_entry": price_entry,
        "id_product": id_product,
        "quantity": stock_product
    });
    
    return response.status(200).json({status:"Atualizado com sucesso"});

  }


}