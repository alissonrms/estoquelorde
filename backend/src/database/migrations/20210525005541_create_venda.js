
exports.up = function(knex) {
    return knex.schema.createTable('sale',function (table) {
        table.increments();      
        table.datetime('date').notNullable();
        table.datetime('pay_date').notNullable();
        
        
        table.string('id_user').notNullable();      
        table.foreign('id_user').references('id').inTable('user');
        
        table.string('id_reseller').notNullable();      
        table.foreign('id_reseller').references('id').inTable('reseller');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('selling');
};
