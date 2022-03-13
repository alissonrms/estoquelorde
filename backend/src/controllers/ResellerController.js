const connection = require('../database/connection');

module.exports = {
  async create(request, response){
    const { reseller_name} = request.body;
    
    const  id_user = request.headers.id_user;

    if(!id_user || !reseller_name){
        return response.status(400).json({status: "Cadastro impossível"});
    }

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
            return response.status(200).json({status: reseller_name + " cadastrado com sucesso"});
        }
        await connection('reseller').insert({
            "name": reseller_name,
            "activated": true,
            "id_user": id_user
        });
        return response.status(200).json({status: reseller_name + " cadastrado com sucesso"});

    }

  },

  async delete(request, response){
    const { reseller_id} = request.params;
    
    const id_user = request.headers.id_user;

    
    if(!id_user || !reseller_id){
        return response.status(400).json({status: "Operação não permitida"});
    }
    const reseller = await connection("reseller")
        .where("id", reseller_id)
        .andWhere('id_user', id_user)
        .select('*')
        .first();

    if(!reseller){
        return response.status(400).json({status: "Revendedor não encontrado!"});
    }
    
    await connection("reseller")
    .where("id", reseller_id)
    .andWhere('id_user', id_user)
    .update({
        "activated": false
    });

    return response.status(204).send();

  },

  async list(request, response){
    
    const id_user = request.headers.id_user;
    
    const result = await connection("reseller")
        .where("id_user", id_user)
        .andWhere("activated", true)
        .andWhere('id_user', id_user)
        .select("name", "id");
    
    return response.json(result);

  },

  async update(request, response){
    const { name, id_reseller} = request.body;
    
    const  id_user = request.headers.id_user;

    if(!id_user || !name || !id_reseller){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
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
        return response.status(400).json({status: "Revendedor não encontrado"});
    }
  }
}