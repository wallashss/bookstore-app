import { Knex, knex } from "knex"


export default class DBConnection {


  db: Knex
  constructor() {
    this.db = knex(
      {
        client: 'sqlite3',
        connection: {
          filename: 'data/bookstore.db'
        },
        useNullAsDefault: true
      }
    )
  }

  getClient () {
    return this.db;
  }
  
}