const connection = require('../../database/connection');
const cryptography = require('./cryptography');

module.exports = {
    async validateDates(datepast, today){
        if(!datepast || !today || !(datepast > 0) || Math.floor(datepast) != datepast
            || !(today > 0) || Math.floor(today) != today){
            return false;
        }else{
            return true;
        }
    },
    async calcSaleValues(sale, datepast, today){
        var sales = 0;
        var commission = 0;
        var profit = 0;
        var pending = 0;
        for(const key in sale){
            sales += 1;
            const com = sale[key].price * sale[key].commission / 100;
            commission += com;
            if(sale[key].paid === true && sale[key].pay_date >= datepast && sale[key].pay_date <= today){
                profit += sale[key].price - com;
            }else{
                pending += sale[key].price - com;
            }
        }

        return {sales, profit, commission, pending};
    },

    async verifyProducts(products, id_user, id_sale){
        for (const key in products) {
            var oldStock = 0;
            const query = await connection('product')
                .where('id', products[key].id_product)
                .andWhere('id_user', id_user)
                .select('stock')
                .first();
            
            if(!query){
                return false
            }

            if(id_sale){
                var sale = await connection('sale_product')
                    .join('sale', 'sale.id', '=', 'sale_product.id_sale')
                    .where('sale.id_user', id_user)
                    .andWhere('sale.id', id_sale)
                    .andWhere('sale_product.id_product', products[key].id_product)
                    .select('sale_product.quantity');

                for( const i in sale){
                    oldStock += sale[i].quantity;
                }
            }

            if(!(products[key]).quantity || !(products[key]).id_product
                || !((products[key]).quantity > 0)
                || Math.floor((products[key]).quantity) != (products[key]).quantity
                || products[key].quantity > query.stock + oldStock
                ){
                return false;
            }
            
        }
        return true;
    },

    async listStatement(request, response, offset, limit){
        const { datepast, today} = request.query;
        
        const  id_user = request.headers.id_user;

        if(!await this.validateDates(datepast, today)){
            return response.status(400).json({status: "Operação não permitida"});
        }
        var result = await connection.select(
                'expense.price_expense as c1',
                'expense.description as c2',
                'reseller.name as c3',
                'expense.id as c4',
                'reseller.id as c5',
                'expense.id_reseller as c6',
                'expense.type as type',
                'expense.date as date')
                .from('expense')
                .join('reseller', 'reseller.id', '=', 'expense.id_reseller')
                .where('expense.id_user', id_user)
                .whereBetween('expense.date', [datepast, today])
                .unionAll([
                connection('sale')
                .where('id_user', id_user)
                .whereBetween('date', [datepast, today])
                .orWhereBetween('pay_date', [datepast, today])
                .andWhere('id_user', id_user)
                .select(
                    'price as c1',
                    'id_reseller as c2',
                    'id_user as c3',
                    'commission as c4',
                    'paid as c5',
                    'id as c6',
                    'type as type',
                    'pay_date as date')
            ])
            .unionAll([
            connection('entry_product')
            .join('product', 'product.id', '=', 'entry_product.id_product')
            .where('entry_product.id_user', id_user)
            .whereBetween('entry_product.date', [datepast, today])
            .select(
                'entry_product.price_entry as c1',
                'entry_product.quantity as c2',
                'product.name as c3',
                'entry_product.id as c4',
                'product.id as c5',
                'entry_product.id_product as c6',
                'entry_product.date as date',
                'entry_product.type as type')
            ])
            .orderBy('date', 'desc').offset(offset).limit(limit);

        const expense = {
            "price": "c1",
            "description": "c2",
            "name": "c3",
            "date": "date",
            "id": "c4",
            "id_reseller": "c5"
        }
        const sale = {
            "price": "c1",
            "id_reseller": "c2",
            "id_user": "c3",
            "date": "date",
            "commission": "c4",
            "paid": "c5",
            "id": "c6"
        }
        const entry = {
            "price": "c1",
            "quantity": "c2",
            "name": "c3",
            "date": "date",
            "id": "c4",
            "id_product": "c5"
        }

        for(const key in result){
            if(result[key].type == 'installment' 
            || result[key].type == 'cash'){
                const products = await connection('sale_product')
                    .join('product', 'product.id', '=', 'sale_product.id_product')
                    .where('sale_product.id_sale', result[key].c6)
                    .select('product.name', 'sale_product.quantity');
                    
                result[key].products = products;
            }
        }

        return response.json({result, expense, sale, entry});

    }
}