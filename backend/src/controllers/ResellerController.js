const connection = require('../database/connection');
const cryptography = require('./cryptography');

module.exports = {
  async create(request, response){
    const {id_user, reseller_name} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !reseller_name){
        return response.status(400).json({status: "Cadastro impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection('reseller')
            .where('name', reseller_name)
            .andWhere('id_user', id_user)
            .select('name')
            .first();
        if(result){
            return response.status(406).json({status: "Representante "+reseller_name+" já está cadastrado"});
        }else{
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
    const {id_user, reseller_id} = request.body;
    const token = request.headers.authorization;

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
    const {id_user} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection("reseller")
            .where("id_user", id_user)
            .andWhere("activated", true)
            .select("name", "id");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  }


}