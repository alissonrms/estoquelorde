const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');


module.exports = {
    
  async create(request, response){
    const { id_reseller, products, price, commission,
         installment, name_client, telephone_client, expire_date} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    const resseler_exist = await connection('reseller')
            .where('id', id_reseller)
            .andWhere('id_user', id_user)
            .andWhere('activated', true)
            .select('name', 'id', 'activated')
            .first();
    
    if(!id_user || !token || !id_reseller 
        || !products || !price
        || !(price > 0) || !(commission > 0)
        || !await functions.verifyProducts(products, id_user)
        || (installment && (!name_client || !telephone_client || !expire_date))
        || !resseler_exist){
        return response.status(400).json({status: "Venda impossível"});
    }
    
    var date = new Date();

    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        await connection('sale').insert({
            'date': date,
            'pay_date': date,
            'id_user': id_user,
            'id_reseller': id_reseller,
            'price': price,
            'commission': commission
        });
        const sale = await connection('sale')
        .where('id_user', id_user)
        .andWhere('date', date)
        .select('id')
        .first();
        
        for (const key in products) {     
            await connection('sale_product').insert({
                'quantity': products[key].quantity,
                'id_user': id_user,
                'id_product': products[key].id_product,
                'id_sale': sale.id
            });
            const queryStock = await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .select('stock')
                .first();
            await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .update({
                    'stock': parseInt(queryStock.stock) - parseInt(products[key].quantity)
                });
        }

        if(installment){
            await connection('installment').insert({
                'name_client': name_client,
                'telephone_client': telephone_client,
                'expire_date': expire_date,
                'id_user': id_user,
                'id_sale': sale.id
            })
            await connection('sale')
            .where('id_user', id_user)
            .andWhere('id', sale.id)
            .update({
                'paid': false,
                'type': 'installment'
            })
        }
        
        return response.status(200).json({status: "Venda realizada com sucesso"});

    }else{
        return response.status(401).json({status: "Venda impossível"});
    }

  },

  async delete(request, response){
    const { id_sale } = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    if(!id_user || !token || !id_sale){
        return response.status(400).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        const sale = await connection('sale_product')
            .join('sale', 'sale.id', '=', 'sale_product.id_sale')
            .where('sale.id_user', id_user)
            .andWhere('sale.id', id_sale)
            .select('sale_product.id_product', 'sale_product.quantity', 'sale_product.id');
        for(const key in sale){
            const product = await connection('product')
                .where('id', sale[key].id_product)
                .select('stock')
                .first();
            const stock = sale[key].quantity + product.stock;
            await connection('product')
                .where('id', sale[key].id_product)
                .update({
                    'stock': stock
                });
            await connection("sale_product")
                .where("id", sale[key].id)
                .andWhere('id_user', id_user)
                .delete();
        }

        await connection("sale")
            .where("id", id_sale)
            .andWhere('id_user', id_user)
            .delete();
        
        await connection("installment")
            .where("id_sale", id_sale)
            .andWhere('id_user', id_user)
            .delete();

        return response.status(204).send();

    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }

  },

  async update(request, response){
    const { id_reseller, id_sale, price, products, commission,
        installment, name_client, telephone_client, expire_date} = request.body;
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;

    var saleDate = connection('sale')
        .where('id_user', id_user)
        .andWhere('id', id_sale)
        .select('id', 'date', 'pay_date')
        .first();

    const resseler_exist = await connection('reseller')
        .where('id', id_reseller)
        .andWhere('id_user', id_user)
        .andWhere('activated', true)
        .select('name', 'id', 'activated')
        .first();
    
    if(!id_user || !token || !id_sale
        || !id_reseller || !price || !products 
        || !(commission > 0) || !(price > 0)
        || !saleDate
        || !await functions.verifyProducts(products, id_user, id_sale)
        || (installment && (!name_client || !telephone_client || !expire_date))
        || !resseler_exist){
        return response.status(400).json({status: "Atualização impossível"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){

        await connection('sale').insert({
            'date': saleDate.date,
            'pay_date': saleDate.pay_date,
            'id_user': id_user,
            'id_reseller': id_reseller,
            'price': price,
            'commission': commission
        });

        var saleId = await connection('sale')
        .max('id', {as: 'id'}).first();
        
        for (const key in products) {     
            await connection('sale_product').insert({
                'quantity': products[key].quantity,
                'id_user': id_user,
                'id_product': products[key].id_product,
                'id_sale': saleId.id
            });
            const queryStock = await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .select('stock')
                .first();
            const newStock = parseInt(queryStock.stock) - parseInt(products[key].quantity);
            await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .update({
                    'stock': newStock
                });
        }

        if(installment){
            await connection('installment').insert({
                'name_client': name_client,
                'telephone_client': telephone_client,
                'expire_date': expire_date,
                'id_user': id_user,
                'id_sale': saleId.id
            })
            await connection('sale')
            .where('id_user', id_user)
            .andWhere('id', saleId.id)
            .update({
                'paid': false,
                'type': 'installment'
            })
        }


        var sale = await connection('sale_product')
            .join('sale', 'sale.id', '=', 'sale_product.id_sale')
            .where('sale.id_user', id_user)
            .andWhere('sale.id', id_sale)
            .select('sale_product.id_product', 'sale_product.quantity', 'sale_product.id');

        for(const key in sale){
            const product = await connection('product')
                .where('id', sale[key].id_product)
                .select('stock')
                .first();
            const stock = sale[key].quantity + product.stock;
            await connection('product')
                .where('id', sale[key].id_product)
                .update({
                    'stock': stock
                });
            await connection("sale_product")
                .where("id", sale[key].id)
                .andWhere('id_user', id_user)
                .delete();
        }

        await connection("sale")
            .where("id", id_sale)
            .andWhere('id_user', id_user)
            .delete();

        await connection("installment")
            .where("id_sale", id_sale)
            .andWhere('id_user', id_user)
            .delete();

        return response.status(200).json({status: "Atualização realizada com sucesso"});
        
    }else{
        return response.status(401).json({status: "Atualização impossível"});
    }
  }

}