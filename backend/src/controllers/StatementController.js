const connection = require('../database/connection');
const cryptography = require('./cryptography');


module.exports = {
  async totalStatement(request, response){
    const {id_user} = request.query;
    const token = request.headers.authorization;

    if(!id_user || !token){
        return response.status(401).json({status: "Operação não permitida"});
    }
    
    const authentication = await cryptography.authenticate(id_user, token);

    if(authentication){
        var today = new Date();

        var year = today.getFullYear();
        var month = today.getMonth() + 1;

        var today = year + "-" + month + "-" + 1 + " " 
        + 00 + ":" + 00 + ":" + 00;

        const expense = await connection("expense")
            .where('id_user', id_user)
            .andWhere('date', '>=', today)
            .sum('price_expense as sum');
        
        const entry_product = await connection('entry_product')
            .where('id_user', id_user)
            .andWhere('date', '>=', today)
            .select('price_entry', 'quantity');

        var total_entry_product = 0;
        for(const key in entry_product){
            total_entry_product += entry_product[key].price_entry * entry_product[key].quantity;
        }

        const selling = await connection('selling_product')
            .join('selling', 'selling.id', '=', 'selling_product.id_selling')
            .where('selling_product.id_user', id_user)
            .andWhere('selling.date', '>=', today)
            .select('selling_product.price', 'selling_product.quantity');

        var total_selling = 0;
        for(const key in selling){
            total_selling += selling[key].price * selling[key].quantity;
        }

        return response.json({
            "expense": expense[0].sum,
            "entry_product": total_entry_product,
            "selling": total_selling
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

        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();

        var today = year + "-" + month + "-" + day + " " 
        + hours + ":" + minutes + ":" + seconds;

        var year = datepast.getFullYear();
        var month = datepast.getMonth() + 1;
        var day = datepast.getDate();
        var hours = datepast.getHours();
        var minutes = datepast.getMinutes();
        var seconds = datepast.getSeconds();

        var datepast = year + "-" + month + "-" + day + " " 
        + hours + ":" + minutes + ":" + seconds;

        var expense = await connection("expense")
        .join("reseller", "expense.id_reseller", "=", "reseller.id")
        .whereBetween('expense.date', [datepast, today])
        .andWhere('expense.id_user', id_user)
        .select("expense.date", "expense.price_expense", 
        "expense.description", "reseller.name", "expense.id");

        for(const key in expense){
        expense[key].type = "expense";
        expense[key].date = expense[key].date.toLocaleString();
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

        var selling_product = await connection("selling_product")
        .join("selling", "selling.id", "=", "selling_product.id_selling")
        .join('product', 'product.id', '=', 'selling_product.id_product')
        .join('reseller', 'reseller.id', '=', 'selling.id_reseller')
        .whereBetween('selling.date', [datepast, today])
        .andWhere('selling_product.id_user', id_user)
        .select('selling.id', 'selling.date', 'reseller.name',
        'product.name', 'selling_product.quantity', 'selling_product.price',
        'selling_product.id as id_selling_product', 'selling_product.id_product as id_product');
        
        for(const key in selling_product){
            selling_product[key].type = "selling";
        }
        

        const result = expense.concat(entry_product).concat(selling_product);

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