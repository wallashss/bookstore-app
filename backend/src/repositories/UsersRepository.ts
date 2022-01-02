
import { Knex } from "knex";
import { User } from "../models/User";
import DBConnection from "../infrastructure/db/DBConnection";


export default class BooksRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }


  async login (username: string, passwd: string) {

    const [user] = await this.db('seller')
      .select('name', 'id', 'username')
      .where({username, passwd})
    
    return user

  }

  async insertUser (user: User) {

    await this.db('seller')
      .insert(user)
    
    return user

  }
}