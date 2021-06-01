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

    var selling_product = await connection("selling_product")
    .join("selling", "selling.id", "=", "selling_product.id_selling")
    .join('product', 'product.id', '=', 'selling_product.id_product')
    .join('reseller', 'reseller.id', '=', 'selling.id_reseller')
    .select('selling.id', 'selling.date', 'reseller.name',
      'product.name', 'selling_product.quantity', 'selling_product.price',
      'selling_product.id as id_selling_product', 'selling_product.id_product as id_product');
    
      for(const key in selling_product){
        selling_product[key].type = "selling";
      }

    const result = expense.concat(entry_product).concat(selling_product);

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