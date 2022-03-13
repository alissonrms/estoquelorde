const connection = require('../database/connection');

module.exports = {
  async create(request, response){
    const id_user = request.headers.id_user;
    const { name} = request.body;

    if(!name){
        return response.status(400).json({status: "Cadastro impossível"});
    }

    const result = await connection('product')
        .where('name', name)
        .andWhere('id_user', id_user)
        .select('name', 'activated', 'id')
        .first();
    if(result && result.activated){
        return response.status(400).json({status: "Produto"+name+" já está cadastrado"});
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


  },

  async delete(request, response){
    const id_user = request.headers.id_user;
    const { product_id} = request.params;

    if(!product_id){
        return response.status(401).json({status: "Operação não permitida"});
    }

    await connection("product")
    .where("id", product_id)
    .andWhere('id_user', id_user)
    .update({
        "activated": false
    });

    return response.status(204).send();


  },

  async list(request, response){
    const id_user = request.headers.id_user;

    const result = await connection("product")
        .where("id_user", id_user)
        .andWhere("activated", true)
        .andWhere('id_user', id_user)
        .select("name", "id", "stock");
    
    return response.json(result);

  },

  async update(request, response){
    const id_user = request.headers.id_user;
    const { name, id_product} = request.body;

    if(!name || !id_product){
        return response.status(400).json({status: "Atualização impossível"});
    }
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
        return response.status(400).json({status: "Produto não encontrado"});
    }
  }


}