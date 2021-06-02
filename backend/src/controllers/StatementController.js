const connection = require('../database/connection');
const cryptography = require('./utilities/cryptography');
const functions = require('./utilities/functions');

module.exports = {
  async values(request, response){
    const {id_user, page} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token || !page
        || !(page > 0)
        || Math.floor(page) != page){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var datepast = new Date();
        datepast = new Date(datepast.getFullYear(), datepast.getMonth() - (page - 1), datepast.getDate());

        var year = datepast.getFullYear();
        var month = datepast.getMonth() + 1;

        var datepast = year + "-" + month + "-" + 1 + " " 
        + 00 + ":" + 00 + ":" + 00;

        var today = new Date();
        today = new Date(today.getFullYear(), today.getMonth() + 1 - (page - 1), today.getDate());
        today.setDate(today.getDate()-1);
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();

        var today = year + "-" + month + "-" + day + " " 
        + 23 + ":" + 59 + ":" + 59;

        const expense = await connection("expense")
            .whereBetween('date', [datepast, today])
            .andWhere('id_user', id_user)
            .sum('price_expense as sum');
        
        const entry_product = await connection('entry_product')
            .whereBetween('date', [datepast, today])
            .andWhere('id_user', id_user)
            .select('price_entry', 'quantity');

        var total_entry_product = 0;
        for(const key in entry_product){
            total_entry_product += entry_product[key].price_entry * entry_product[key].quantity;
        }

        const sale = await connection('sale_product')
            .join('sale', 'sale.id', '=', 'sale_product.id_sale')
            .whereBetween('sale.date', [datepast, today])
            .andWhere('sale_product.id_user', id_user)
            .select('sale_product.price', 'sale_product.quantity');

        var total_sale = 0;
        for(const key in sale){
            total_sale += sale[key].price * sale[key].quantity;
        }

        return response.json({
            "expense": expense[0].sum,
            "entry_product": total_entry_product,
            "sale": total_sale,
            "date": today,
            "datepast": datepast
        });
        
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  },

  async list(request, response){
    const {id_user, page} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token || !page
        || !(page > 0)
        || Math.floor(page) != page){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var datepast = new Date();
        var today = new Date();
        datepast.setDate(datepast.getDate() - (7 * page));
        today.setDate(today.getDate() - (7 * (page - 1)));

        var today = functions.formatDate(today);

        var datepast = functions.formatDate(datepast);

        var expense = await connection("expense")
            .join("reseller", "expense.id_reseller", "=", "reseller.id")
            .whereBetween('expense.date', [datepast, today])
            .andWhere('expense.id_user', id_user)
            .select("expense.date", "expense.price_expense", 
            "expense.description", "reseller.name", "expense.id");

        for(const key in expense){
            expense[key].type = "expense";
        
        }

        var entry_product = await connection("entry_product")
                .join("product", "entry_product.id_product", "=", "product.id")
                .whereBetween('entry_product.date', [datepast, today])
                .andWhere('entry_product.id_user', id_user)
                .select("product.name", "entry_product.id",
                "entry_product.date", "entry_product.price_entry", "entry_product.quantity");
        
        for(const key in entry_product){
        entry_product[key].type = "entry";
        }

        var sale_product = await connection("sale_product")
            .join("sale", "sale.id", "=", "sale_product.id_sale")
            .join('product', 'product.id', '=', 'sale_product.id_product')
            .join('reseller', 'reseller.id', '=', 'sale.id_reseller')
            .whereBetween('sale.date', [datepast, today])
            .andWhere('sale_product.id_user', id_user)
            .select('sale.id', 'sale.date', 'reseller.name',
            'product.name', 'sale_product.quantity', 'sale_product.price',
            'sale_product.id as id_sale_product', 'sale_product.id_product as id_product');
        
        for(const key in sale_product){
            sale_product[key].type = "sale";
        }


        const result = expense.concat(entry_product).concat(sale_product);

        function orderDate(a, b) {
        if (a.date < b.date) {
        return 1;
        }
        if (a.date > b.date) {
        return -1;
        }
        // a must be equal to b
        return 0;
        }


        return response.json(result.sort(orderDate));
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
  }

}