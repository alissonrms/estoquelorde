const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async create(request, response){
    const { price_expense, description, id_reseller} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;
    
    if(!id_user || !token || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller){
        return response.status(400).json({status: "Cadastro impossível"});
    }

    const date = new Date();
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
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
        
        
    }else{
        return response.status(401).json({status: "Cadastro impossível"});
    }

  },

  async delete(request, response){
    const { expense_id} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !expense_id){
        return response.status(400).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection("expense")
        .where("id", expense_id)
        .andWhere('id_user', id_user)
        .delete();

        return response.status(204).send();

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }

  },

  async update(request, response){
    const {price_expense, description, id_reseller, id_expense} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;
    
    if(!id_user || !token || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller || !id_expense){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
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
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }

  }


}