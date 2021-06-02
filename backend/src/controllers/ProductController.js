const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');

module.exports = {
  async create(request, response){
    const {id_user, name} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !name){
        return response.status(400).json({status: "Cadastro impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('product')
            .where('name', name)
            .andWhere('id_user', id_user)
            .select('name')
            .first();
        if(result){
            return response.status(406).json({status: "Produto"+name+" já está cadastrado"});
        }else{
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
    const {id_user, product_id} = request.body;
    const token = request.headers.authorization;

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
    const {id_user} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection("product")
            .where("id_user", id_user)
            .andWhere("activated", true)
            .select("name", "id", "stock");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const {id_user, name, id_product} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !name || !id_product){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('product')
            .where('id', id_product)
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