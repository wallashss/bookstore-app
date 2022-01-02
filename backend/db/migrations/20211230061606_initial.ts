import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('book', (table) => {
    table.increments('id').primary()
    table.string('name', 256)
    table.string('indexName', 128)
    table.float('price')
    table.integer('publisherId')
    table.string('publisherCode', 128)
  })

  await knex.schema.createTable('book_request_item', (table) => {
    table.increments('id').primary()
    table.integer('bookId')
    table.integer('requestId')
    table.float('currentPrice')
    table.string('status', 1)
  })

  await knex.schema.createTable('book_request', (table) => {
    table.increments('id').primary()
    table.integer('sellerId')
    table.string('client', 256)
    table.timestamp('requestDate')
    table.string('clientPhone', 32)
    table.string('clientEmail', 128)
    table.string('clientCpf', 32)
    table.string('clientAddress', 512)
    table.boolean('isClosed')
    table.string('notes', 512)
    table.float('wrapPrice')
    table.float('discount')
  })

  await knex.schema.createTable('seller', (table) => {
    table.increments('id').primary()
    table.string('username', 128)
    table.string('name', 64)
    table.string('passwd', 128)
  })

  await knex.schema.createTable('publisher', (table) => {
    table.increments('id').primary()
    table.string('name', 128)
  })
}

export async function down(knex: Knex): Promise<void> {

  await knex.schema.dropTableIfExists('book')
  await knex.schema.dropTableIfExists('book_request_item')
  await knex.schema.dropTableIfExists('book_request')
  await knex.schema.dropTableIfExists('seller')
  await knex.schema.dropTableIfExists('publisher')
}

