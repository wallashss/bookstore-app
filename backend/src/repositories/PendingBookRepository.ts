
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
      .whereIn('status', ['P', 'R', 'A'])

    const sellerQuery = sellerId ? 
      query.where('book_request.sellerId', sellerId) :
      query;
    
    return search ? 
      sellerQuery.where('book_request.client', 'like', `%${search}%`) :
      sellerQuery
  }

  async getPendingPublishers () {

    const rows = await this.db('book_request_item')
      .select(
        'publisher.name as name',
        'publisher.id as id')
      .innerJoin('book', 'book.id', 'book_request_item.bookId')
      .innerJoin('publisher', 'book.publisherId', 'publisher.id')
      .innerJoin('book_request', 'book_request.id', 'book_request_item.requestId')
      .where('status', 'P')
      .distinct()
      .orderBy('name')

    return rows

  }

  async updateRequestItemStatus(id: number, status: RequestItemStatus) {

    return this.db('book_request_item')
      .where({id})
      .update({status: status})
  }

  async updateRequestItemStatusForRequest(requestId: number, status: RequestItemStatus) {
    return this.db('book_request_item')
      .where({requestId})
      .update({status})
  }
  
  async updateRequestItemStatusForPublisher(publisherId: number, status: RequestItemStatus) {

    const subquery = this.db('book').where({publisherId}).select('id')
    return this.db('book_request_item')
      .whereIn('bookId', subquery)
      .andWhere('status', 'P')
      .update({status})
  }

  async getPendingFromPublisher(publisherId: number) {

    // const subquery = this.db('book').where({publisherId}).select('id')
    return this.db('book_request_item')
      .innerJoin('book', 'book.id', 'book_request_item.bookId')
      .where('book.publisherId', publisherId)
      .andWhere('book_request_item.status', 'P')
      .select('book_request_item.*', 'book.name', 'book.publisherCode')
      .count('book.id as count')
      .sum('book.price as sum')
      .andWhere('status', 'P')
      .groupBy('book.id')
  }

}