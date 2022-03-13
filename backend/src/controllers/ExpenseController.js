const connection = require('../database/connection');

module.exports = {
  async create(request, response){
    const { price_expense, description, id_reseller} = request.body;
    
    const id_user = request.headers.id_user;
    
    if(!id_user || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller){
        return response.status(400).json({status: "Cadastro impossível"});
    }

    const date = new Date();

    const result = await connection('reseller')
    .where('id', id_reseller)
    .andWhere('id_user', id_user)
    .select('id')
    .first();

    if(result){
        await connection('expense').insert({
            'date': date,
            'price_expense': price_expense,
            'description': description,
            'id_reseller': id_reseller,
            'id_user': id_user
        });
        return response.status(200).json({status: "Despesa cadastrada com sucesso"});

    }else{
        return response.status(400).json({status: "Revendedor não encontrado!"});
    }
    

  },

  async delete(request, response){
    const { expense_id} = request.params;
    
    const  id_user = request.headers.id_user;

    if(!id_user || !expense_id){
        return response.status(400).json({status: "Operação não permitida"});
    }

    await connection("expense")
    .where("id", expense_id)
    .andWhere('id_user', id_user)
    .delete();

    return response.status(204).send();

  },

  async update(request, response){
    const {price_expense, description, id_reseller, id_expense} = request.body;
    
    const  id_user = request.headers.id_user;
    
    if(!id_user || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller || !id_expense){
        return response.status(400).json({status: "Atualização impossível"});
    }

    const resultA = await connection('reseller')
        .where('id', id_reseller)
        .andWhere('id_user', id_user)
        .select('id')
        .first();
    const resultB = await connection('expense')
        .where('id', id_expense)
        .andWhere('id_user', id_user)
        .select('id')
        .first();

    if(resultA && resultB){
        await connection('expense')
        .where("id", id_expense)
        .andWhere('id_user', id_user)
        .update({
            'price_expense': price_expense,
            'description': description,
            'id_reseller': id_reseller
        });
        return response.status(200).json({status:"Despesa atualizada com sucesso"});
    }else{
        return response.status(400).json({status: "Revendedor não encontrado"});
    }

  }
}