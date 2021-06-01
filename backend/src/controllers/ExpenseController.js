const connection = require('../database/connection');
const cryptography = require('./cryptography');

module.exports = {
  async create(request, response){
    const {id_user, price_expense, description, id_reseller} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller){
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
        const result = await connection('reseller')
        .where('id', id_reseller)
        .andWhere('id_user', id_user)
        .select('id')
        .first();

        if(result){
            await connection('expense').insert({
                'date': full_date,
                'price_expense': price_expense,
                'description': description,
                'id_reseller': id_reseller,
                'id_user': id_user
            });
            return response.status(200).json({status: "Despesa cadastrada com sucesso"});

        }else{
            return response.status(401).json({status: "Revendedor não encontrado!"});
        }
        
        
    }else{
        return response.status(401).json({status: "Cadastro impossível"});
    }

  },

  async delete(request, response){
    const {id_user, expense_id} = request.body;
    const token = request.headers.authorization;

    if(!id_user || !token || !expense_id){
        return response.status(401).json({status: "Operação não permitida"});
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

  async list(request, response){
    const {id_user} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const result = await connection("expense")
            .join("reseller", "expense.id_reseller", "=", "reseller.id")
            .where("expense.id_user", id_user)
            .select("expense.date", "expense.price_expense", 
            "expense.description", "reseller.name", "expense.id");
        
        return response.json(result);

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async update(request, response){
    const {id_user, price_expense, description, id_reseller, id_expense} = request.body;
    const token = request.headers.authorization;
    
    if(!id_user || !token || !price_expense 
        || !(price_expense > 0) || !description || !id_reseller || !id_expense){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const resultA = await connection('reseller')
            .where('id', id_reseller)
            .select('id')
            .first();
        const resultB = await connection('expense')
            .where('id', id_expense)
            .select('id')
            .first();

        if(resultA && resultB){
            await connection('expense')
            .where("id", id_expense)
            .update({
                'price_expense': price_expense,
                'description': description,
                'id_reseller': id_reseller
            });
            return response.status(200).json({status:"Despesa atualizada com sucesso"});
        }else{
            return response.status(406).json({status: "Revendedor não encontrado"});
        }
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }

  }


}