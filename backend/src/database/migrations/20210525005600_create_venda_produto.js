
exports.up = function(knex) {
    return knex.schema.renameTable('sale_product', function (table) {
        table.increments();      
        table.integer('quantity').notNullable();
        table.float('price').notNullable();

        table.string('id_product').notNullable();      
        table.foreign('id_product').references('id').inTable('product');

        table.string('id_sale').notNullable();      
        table.foreign('id_sale').references('id').inTable('sale');
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('sale_product');
};
