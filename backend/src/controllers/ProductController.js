const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');

module.exports = {
  async create(request, response){
    const { name} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !name){
        return response.status(400).json({status: "Cadastro impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('product')
            .where('name', name)
            .andWhere('id_user', id_user)
            .select('name', 'activated', 'id')
            .first();
        if(result && result.activated){
            return response.status(406).json({status: "Produto"+name+" já está cadastrado"});
        }else{
            if(result && !result.activated){
                await connection('product')
                    .where("id", result.id)
                    .update({
                        "activated": true
                    });
                return response.status(200).json({status: name + " cadastrado com sucesso"});
            }
            await connection('product').insert({
                "name": name,
                "activated": true,
                "id_user": id_user,
                "stock": 0
            });
            return response.status(200).json({status: name + " cadastrado com sucesso"});

        }
        
    }else{
        return response.status(401).json({status: "Cadastro impossível"});
    }

  },

  async delete(request, response){
    const { product_id} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !product_id){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection("product")
        .where("id", product_id)
        .andWhere('id_user', id_user)
        .update({
            "activated": false
        });

        return response.status(204).send();

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }

  },

  async list(request, response){
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection("product")
            .where("id_user", id_user)
            .andWhere("activated", true)
            .andWhere('id_user', id_user)
            .select("name", "id", "stock");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const { name, id_product} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !name || !id_product){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('product')
            .where('id', id_product)
            .andWhere('id_user', id_user)
            .select('name')
            .first();
        if(result){
            await connection('product')
            .where("id", id_product)
            .update({
                "name": name
            });
            return response.status(200).json({status: name + " atualizado com sucesso"});
        }else{
            return response.status(406).json({status: "Produto não encontrado"});
        }
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }

  }


}