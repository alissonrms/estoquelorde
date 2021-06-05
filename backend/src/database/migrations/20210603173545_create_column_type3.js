
exports.up = function(knex) {
    return knex.schema.table('entry_product', function (table) {
        table.text('type').notNullable().defaultTo('entry');
    })
};

exports.down = function(knex) {
  
};
