
import { Knex } from "knex";
import {RequestItemStatus} from "../models/RequestItem";
import DBConnection from "../infrastructure/db/DBConnection";


export default class PendingBookRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }

  async getPendingBooks (sellerId?: number, search?: string) {

    const query = this.db('book_request_item')
      .select('book_request_item.*', 
        'book.name as name',
        'publisher.name as publisherName',
        'book.publisherCode as publisherCode',
        'seller.name as sellerName',
        'book_request.requestDate as requestDate',
        'book_request.clientCpf as clientCpf',
        'book_request.client as clientName')
      .innerJoin('book', 'book.id', 'book_request_item.bookId')
      .innerJoin('publisher', 'book.publisherId', 'publisher.id')
      .innerJoin('book_request', 'book_request.id', 'book_request_item.requestId')  
      .innerJoin('seller', 'seller.id', 'book_request.sellerId')

    const sellerQuery = sellerId ? 
      query.where('book_request.sellerId', sellerId) :
      query;
    
    return search ? 
      sellerQuery.where('book_request.client', 'like', `%${search}%`) :
      sellerQuery
  }

  async updateRequestItemStatus(id: number, status: RequestItemStatus) {

    return this.db('book_request_item')
      .where({id})
      .update({status: status})
  }

}