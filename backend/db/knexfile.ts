// Update with your config settings.
import {Knex} from 'knex'
import path from 'path'

import dotenv from 'dotenv'

const envFilepath = path.join(process.cwd(), '.env')
const dbPath = process.env.DB_PATH ? 
  path.resolve(path.join(process.cwd(), process.env.DB_PATH)) :
  null

dotenv.config({path: envFilepath});

const migrationsDir = path.resolve('../db/migrations');

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath || '../data/bookstore.db'
  },
  migrations: {
    directory: migrationsDir,
    tableName: `bookstore_migrations`
  },
  useNullAsDefault: true
}

const out = {
  migration: config
}

module.exports = config
// export default out