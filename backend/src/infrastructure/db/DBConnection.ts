import { Knex, knex } from "knex"


export default class DBConnection {


  db: Knex
  constructor(filename : string) {
    this.db = knex(
      {
        client: 'sqlite3',
        connection: {
          filename: filename
        },
        useNullAsDefault: true
      }
    )
  }

  getClient () {
    return this.db;
  }
  
}