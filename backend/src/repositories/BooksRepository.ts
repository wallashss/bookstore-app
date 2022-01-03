
import { Knex } from "knex";
import Book from "models/Book";
import DBConnection from "../infrastructure/db/DBConnection";


export default class BooksRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }

  async getBooks (search : string) {

    const query = this.db('book')
      .select('book.id', 
        'book.name as name', 
        'book.publisherCode as publisherCode', 
        'book.price', 
        'publisher.name as publisherName')
      .innerJoin('publisher', 'book.publisherId', 'publisher.id')
    
    if(search) {
      return query
        .where('book.indexName', 'like', `%${search}%`)
        .orWhere('book.name', 'like', `%${search}%`)
    }
    else {
      return query.limit(500)
    }
  }

  async insertBooks (books : Book[]) {

    console.log("Inserting", books.length)
    const batchSize = 250;
    const batchCount = books.length / batchSize;

    for(let i =0; i<=batchCount; i++) {
      let batch = books.slice(i * batchSize, i * batchSize + batchSize)
      console.log(`Batch ${i+1}`, batch.length)
      await this.db('book').insert(batch)
    }
    console.log("Done inserting", books.length)
  }
}