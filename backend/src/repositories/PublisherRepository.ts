
import { Knex } from "knex";
import Book from "models/Book";
import DBConnection from "../infrastructure/db/DBConnection";

export default class PublisherRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }

  async getPublishers () {

    return this.db('publisher')
  }

  async getPublisher (id: number) {

    const [publisher] = await this.db('publisher')
      .where({id})

    return publisher || null
  }
}