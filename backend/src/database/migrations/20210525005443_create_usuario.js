
exports.up = function(knex) {
    return knex.schema.createTable('user', function(table){
        table.increments();
        table.string('password').notNullable();
        table.string('username').notNullable();
        table.string('salt').notNullable();
        table.string('salt_session');
        
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user');
};
