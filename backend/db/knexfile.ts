// Update with your config settings.
import {Knex} from 'knex'
import path from 'path'


const filepath = path.resolve('../db/migrations');

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: '../data/bookstore.db'
  },
  migrations: {
    directory: filepath,
    tableName: `bookstore_migrations`
  },
  useNullAsDefault: true
}

const out = {
  migration: config
}

export default out