
exports.up = function(knex) {
    return knex.schema.createTable('installment', function (table) {
        table.increments();      
        table.string('name_client').notNullable();
        table.integer('telephone_client').notNullable();
        table.datetime('expire_date').notNullable();
        
        table.string('id_sale').notNullable();      
        table.foreign('id_sale').references('id').inTable('sale');
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('installment');
};
