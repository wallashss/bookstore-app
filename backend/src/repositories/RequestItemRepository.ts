
import { Knex } from "knex";
import RequestItem from "../models/RequestItem";
import {RequestItemStatus} from "../models/RequestItem";
import DBConnection from "../infrastructure/db/DBConnection";


export default class RequestItemRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }

  async getRequestBooks (requestId : number) {

    return await this.db('book_request_item')
      .select('book_request_item.*', 
        'book.name as name',
        'publisher.name as publisherName',
        'book.publisherCode as publisherCode')
      .innerJoin('book', 'book.id', 'book_request_item.bookId')
      .innerJoin('publisher', 'book.publisherId', 'publisher.id')
      .where({requestId})    
  }

  async addItem (book : RequestItem) {
    return await this.db('book_request_item')
      .insert({...book, status: book.status || RequestItemStatus.Pending})
  }

  async removeRequestBook (id : number) {
    return await this.db('book_request_item')
      .where({id})    
      .del()
  }

}