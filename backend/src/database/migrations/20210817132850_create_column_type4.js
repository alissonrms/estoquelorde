
exports.up = function(knex) {
    return knex.schema.table('sale', function (table) {
        table.text('type').notNullable().defaultTo('cash');
    })
};

exports.down = function(knex) {
  
};