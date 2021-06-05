const connection = require('../../database/connection');
const cryptography = require('./cryptography');

module.exports = {
    formatDate(today){
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();

        return year + "-" + month + "-" + day + " " 
        + hours + ":" + minutes + ":" + seconds;
    },

    async queryListStatement(request, response, offset, limit){
        const {id_user, datepast, today} = request.query;
        const token = request.headers.authorization;

        if(!id_user || !token || !datepast || !today
        || !(datepast > 0)
        || Math.floor(datepast) != datepast
        || !(today > 0)
        || Math.floor(today) != today){
            return response.status(401).json({status: "Operação não permitida"});
        }
        
        const authentication = await cryptography.authenticate(id_user, token);

        if(authentication){
            var result = await connection.select(
                'expense.price_expense as c1',
                    'expense.description as c2',
                    'reseller.name as c3',
                    'expense.date as date',
                    'expense.id as c4',
                    'reseller.id as c5',
                    'expense.type as type')
                    .from('expense')
                    .join('reseller', 'reseller.id', '=', 'expense.id_reseller')
                    .where('expense.id_user', id_user)
                    .whereBetween('expense.date', [datepast, today])
                    .unionAll([
                    connection('sale_product')
                    .join('sale', 'sale.id', '=', 'sale_product.id_sale')
                    .join('product', 'product.id', '=', 'sale_product.id_product')
                    .where('sale_product.id_user', id_user)
                    .whereBetween('sale.date', [datepast, today])
                    .select('sale_product.price',
                    'sale_product.quantity',
                    'product.name',
                    'sale.date',
                    'sale.id',
                    'sale_product.id',
                    'sale_product.type as type')
                ])
                .unionAll([
                connection('entry_product')
                .join('product', 'product.id', '=', 'entry_product.id_product')
                .where('entry_product.id_user', id_user)
                .whereBetween('entry_product.date', [datepast, today])
                .select('entry_product.price_entry',
                'entry_product.quantity',
                'product.name',
                'entry_product.date',
                'entry_product.id',
                'product.id',
                'entry_product.type as type')
                ])
                .orderBy('date', 'desc').offset(offset).limit(limit);
    
                const expense = {
                    "price": "c1",
                    "description": "c2",
                    "name": "c3",
                    "date": "date",
                    "id_expense": "c4",
                    "id_reseller": "c5"
                }
                const sale = {
                    "price": "c1",
                    "quantity": "c2",
                    "name": "c3",
                    "date": "date",
                    "id_sale": "c4",
                    "id_sale_product": "c5"
                }
                const entry = {
                    "price": "c1",
                    "quantity": "c2",
                    "name": "c3",
                    "date": "date",
                    "id_entry_product": "c4",
                    "id_product": "c5"
                }

            return response.json({result, expense, sale, entry});
        }else{
            return response.status(401).json({status: "Operação não permitida"});
        }
    }

}