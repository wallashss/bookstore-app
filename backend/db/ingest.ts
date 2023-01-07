// Update with your config settings.
import {Knex} from 'knex'
import path from 'path'

import dotenv from 'dotenv'

console.log(process.cwd())
const envFilepath = path.resolve(path.join(process.cwd(), '../.env'))
console.log(envFilepath)

dotenv.config({path: envFilepath});

const dbPath = process.env.DB_PATH ? 
    process.env.DB_PATH:
    null

console.log("DB PATH: ", dbPath || `Default: ../data/bookstore.db`)

const migrationsDir = path.resolve('../db/ingestions');

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: dbPath || '../data/bookstore.db'
  },
  migrations: {
    directory: migrationsDir,
    tableName: `ingestions_migrations`
  },
  useNullAsDefault: true
}

const out = {
  migration: config
}

module.exports = config