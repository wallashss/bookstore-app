import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('book_request', (table) => {
    table.string('whatsapp', 32)
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('book_request', (table) => {
    table.dropColumn('whatsapp')
  })
}

