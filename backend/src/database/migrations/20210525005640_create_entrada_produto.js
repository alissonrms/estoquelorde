
exports.up = function(knex) {
    return knex.schema.createTable('entry_product', function (table) {
        table.increments();      
        table.datetime('date_entry').notNullable();
        table.float('price_entry').notNullable();

        table.string('id_product').notNullable();      
        table.foreign('id_product').references('id').inTable('product');
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('entry_product');
};
