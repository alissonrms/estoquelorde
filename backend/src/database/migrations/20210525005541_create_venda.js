
exports.up = function(knex) {
    return knex.schema.createTable('selling', function (table) {
        table.increments();      
        table.datetime('date_selling').notNullable();
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
        
        table.string('id_reseller').notNullable();      
        table.foreign('id_reseller').references('id').inTable('reseller');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('selling');
};
