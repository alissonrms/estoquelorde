
exports.up = function(knex) {
    return knex.schema.createTable('expense', function (table) {
        table.increments();      
        table.datetime('date').notNullable();
        
        table.float('price_expense').notNullable();
        table.text('description').notNullable();

        table.string('id_reseller').notNullable();      
        table.foreign('id_reseller').references('id').inTable('reseller');
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('expense');
};
