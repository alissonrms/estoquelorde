const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');

module.exports = {
    async list(request, response){
        const token = request.headers.authorization;
        const id_user = request.headers.id_user;

        const authentication = await cryptography.authenticate(id_user, token);

        if(authentication){
            var result = await connection("installment")
                .where("id_user", id_user)
                .select("id", "name_client", "telephone_client", "expire_date", "id_sale");
    

            for(const key in result){
                const products = await connection('sale_product')
                        .join('product', 'product.id', '=', 'sale_product.id_product')
                        .where('sale_product.id_sale', result[key].id_sale)
                        .select('product.name', 'sale_product.quantity');
                
                result[key].products = products;
            }
            
            return response.json(result);
    
        }else{
            return response.status(401).json({status: "Operação não permitida"});
        }
    },
  async delete(request, response){
      const {id_installment} = request.params;
      const token = request.headers.authorization;
      const id_user = request.headers.id_user;

      if(!id_installment){
        return response.status(400).json({status: "Pagamento impossível"});
      }

      const authentication = await cryptography.authenticate(id_user, token);


      if(authentication){
          const id_sale = await connection('installment')
          .where('id_user', id_user)
          .andWhere('id', id_installment)
          .select('id_sale')
          .first();

          if(id_sale){
              await connection('installment')
              .where('id_user', id_user)
              .andWhere('id', id_installment)
              .delete();
    
              await connection('sale')
              .where('id_user', id_user)
              .andWhere('id', id_sale.id_sale)
              .update({
                  'pay_date': new Date(),
                  'paid': true
              })

              return response.status(200).json({status: "Pagamento realizado com sucesso"});
          }else{
            return response.status(400).json({status: "Pagamento impossível"});
          }

        }else{
            return response.status(401).json({status: "Pagamento impossível"});
      }
    
  }

}