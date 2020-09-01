"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//cria tabela e altera campos
//migration api (documentação)
async function up(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.string('whatsapp').notNullable();
        table.string('bio').notNullable();
    });
}
exports.up = up;
//desfaz as cagadas
async function down(knex) {
    return knex.schema.dropTable('users');
}
exports.down = down;
