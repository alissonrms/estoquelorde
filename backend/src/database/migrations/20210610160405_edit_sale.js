
exports.up = function(knex) {
    return knex.schema.table('sale', function (table) {
        table.float('commission').notNullable();
        table.float('price').notNullable();
        table.boolean('paid').notNullable().defaultTo(true);
    })
};

exports.down = function(knex) {
  
};
