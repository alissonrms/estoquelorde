const connection = require('../database/connection');



module.exports = {
  async allUsers(request, response){

    var expense = await connection("expense")
    .join("reseller", "expense.id_reseller", "=", "reseller.id")
    .select("expense.date", "expense.price_expense", 
    "expense.description", "reseller.name", "expense.id");

    for(const key in expense){
      expense[key].type = "expense";
    }

    var entry_product = await connection("entry_product")
            .join("product", "entry_product.id_product", "=", "product.id")
            .select("product.name", "entry_product.id",
            "entry_product.date", "entry_product.price_entry", "entry_product.quantity");
    
    for(const key in entry_product){
      entry_product[key].type = "entry";
    }

    var sale_product = await connection("sale_product")
    .join("sale", "sale.id", "=", "sale_product.id_sale")
    .join('product', 'product.id', '=', 'sale_product.id_product')
    .join('reseller', 'reseller.id', '=', 'sale.id_reseller')
    .select('sale.id', 'sale.date', 'reseller.name',
      'product.name', 'sale_product.quantity', 'sale_product.price',
      'sale_product.id as id_sale_product', 'sale_product.id_product as id_product');
    
      for(const key in sale_product){
        sale_product[key].type = "sale";
      }

    const result = expense.concat(entry_product).concat(sale_product);

    function orderDate(a, b) {
      if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    // a must be equal to b
    return 0;
    }


    return response.json(result.sort(orderDate));
  }


}