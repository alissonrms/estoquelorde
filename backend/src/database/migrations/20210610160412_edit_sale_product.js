
exports.up = function(knex) {
    return knex.schema.table('sale_product', function (table) {
        table.dropColumn('price')
    })
};

exports.down = function(knex) {
  
};
