

import { Knex, knex } from "knex"
import path from 'path'
const dbPath = path.join(process.cwd(), process.env.DB_PATH)

const db = knex(
  {
    client: 'sqlite3',
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true
  }
)

db.raw(`update bookstore_migrations 
        set name = substr(name, 0, length(name)-1) ||  'js'`)
.then((data) => {
  console.log(data)
  console.log('done')
  process.exit(0)
})
.catch(err => {
  console.log(err)
})

