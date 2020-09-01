"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//cria tabela e altera campos
//migration api (documentação)
async function up(knex) {
    return knex.schema.createTable('service_schedule', table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();
        //Interliga as aulas ao professor
        table.integer('service_id')
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
    return knex.schema.dropTable('service_schedule');
}
exports.down = down;
