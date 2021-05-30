const connection = require('../database/connection');
const cryptography = require('./cryptography');

module.exports = {
  async create(request, response){
    const {id_user, id_product, price_entry, stock_product} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !id_product 
        || !(price_entry > 0) || !(stock_product > 0)
        || Math.floor(stock_product) != stock_product){
        return response.status(400).json({status: "Cadastro impossível"});
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
        
        const result = await connection("product")
        .where("id", id_product)
        .andWhere('id_user', id_user)
        .select("stock")
        .first();

        if(result){
            const stock = parseInt(result.stock) + parseInt(stock_product);

            await connection('entry_product').insert({
                "date_entry": full_date,
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
        }else{
            return response.status(400).json({status: "Produto não encontrado!"});
        }

    }else{
        return response.status(401).json({status: "Cadastro impossível"});
    }

  },

  async delete(request, response){
    const {id_user, entry_product_id, } = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !entry_product_id){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const resultA = await connection('entry_product')
            .where('id', entry_product_id)
            .select('quantity', 'id_product')
            .first();
        const resultB = await connection('product')
            .where('id', resultA.id_product)
            .select('stock')
            .first();
        const stock = parseInt(resultB.stock) - parseInt(resultA.quantity);
        if(stock < 0){
            return response.status(401).json({status: "Estoque insuficiente para realizar esta ação"});
        }
        await connection('product')
            .where("id", resultA.id_product)
            .update({
                "stock": stock
            });

        await connection("entry_product")
        .where("id", entry_product_id)
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
        const result = await connection("entry_product")
            .join("product", "entry_product.id_product", "=", "product.id")
            .where("entry_product.id_user", id_user)
            .select("product.name", "entry_product.id",
            "entry_product.date_entry", "entry_product.price_entry", "entry_product.quantity");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const {id_user, id_product, price_entry, stock_product, id_entry_product} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !id_product 
        || !(price_entry > 0) || !(stock_product > 0)
        || Math.floor(stock_product) != stock_product
        || !id_entry_product){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const resultA = await connection('entry_product')
            .where('id', id_entry_product)
            .select('quantity', 'id_product')
            .first();
        const resultB = await connection('product')
            .where('id', id_product)
            .select('stock', 'id')
            .first();
        const resultC = await connection('product')
            .where('id', resultA.id_product)
            .select('stock', 'id')
            .first();

        if(resultA && resultB && resultC){
            if(resultB.id == resultC.id){
                var stockA = parseInt(resultB.stock) + parseInt(stock_product) - parseInt(resultA.quantity);
                if(stockA < 0){
                    return response.status(401).json({status: "Estoque insuficiente para realizar esta ação"});
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
        }else{
            return response.status(406).json({status: "Produto não encontrado"});
        }
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }

  }


}