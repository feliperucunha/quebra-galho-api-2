"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//cria tabela e altera campos
//migration api (documentação)
async function up(knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary();
        table.string('subject').notNullable();
        table.string('cost').notNullable();
        //Interliga as aulas ao professor
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
    });
}
exports.up = up;
//desfaz as cagadas
async function down(knex) {
    return knex.schema.dropTable('services');
}
exports.down = down;
