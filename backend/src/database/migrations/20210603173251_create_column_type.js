
exports.up = function(knex) {
    return knex.schema.table('sale_product', function (table) {
        table.text('type').notNullable().defaultTo('sale');
    })
};

exports.down = function(knex) {
  
};
