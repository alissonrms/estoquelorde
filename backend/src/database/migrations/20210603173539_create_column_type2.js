
exports.up = function(knex) {
    return knex.schema.table('expense', function (table) {
        table.text('type').notNullable().defaultTo('expense');  
    })
};

exports.down = function(knex) {
  
};
