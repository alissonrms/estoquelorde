
exports.up = function(knex) {
    return knex.schema.createTable('product', function (table) {
        table.increments();      
        table.string('name').notNullable();
        table.integer('stock').notNullable();
        table.boolean('activated').notNullable();
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('product');
};
