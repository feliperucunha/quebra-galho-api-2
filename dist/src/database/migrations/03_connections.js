"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//cria tabela e altera campos
//migration api (documentação)
async function up(knex) {
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();
        //Verifica quem é o usuário
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        //Verifica a entrada dos usuários no sistema
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
    });
}
exports.up = up;
//desfaz as cagadas
async function down(knex) {
    return knex.schema.dropTable('connections');
}
exports.down = down;
