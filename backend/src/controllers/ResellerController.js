const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');

module.exports = {
  async create(request, response){
    const { reseller_name} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !reseller_name){
        return response.status(400).json({status: "Cadastro impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('reseller')
            .where('name', reseller_name)
            .andWhere('id_user', id_user)
            .select('name', 'id', 'activated')
            .first();
        if(result && result.activated){
            return response.status(406).json({status: "Representante "+reseller_name+" já está cadastrado"});
        }else{
            if(result && !result.activated){
                await connection('reseller')
                    .where("id", result.id)
                    .update({
                        "activated": true
                    });
                return response.status(200).json({status: name + " cadastrado com sucesso"});
            }
            await connection('reseller').insert({
                "name": reseller_name,
                "activated": true,
                "id_user": id_user
            });
            return response.status(200).json({status: reseller_name + " cadastrado com sucesso"});

        }
        
    }else{
        return response.status(401).json({status: "Cadastro impossível"});
    }

  },

  async delete(request, response){
    const { reseller_id} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !reseller_id){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection("reseller")
        .where("id", reseller_id)
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
        const result = await connection("reseller")
            .where("id_user", id_user)
            .andWhere("activated", true)
            .andWhere('id_user', id_user)
            .select("name", "id");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const { name, id_reseller} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !name || !id_reseller){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('reseller')
            .where('id', id_reseller)
            .select('name')
            .first();
        if(result){
            await connection('reseller')
            .where("id", id_reseller)
            .update({
                "name": name
            });
            return response.status(200).json({status: name + " atualizado com sucesso"});
        }else{
            return response.status(406).json({status: "Revendedor não encontrado"});
        }
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }

  }


}