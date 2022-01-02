
import { Knex } from "knex";
import Request from "models/Request";
import DBConnection from "../infrastructure/db/DBConnection";


export default class RequestRepository {

  db : Knex
  constructor (
    private readonly dbConnection : DBConnection
  ) {
    this.db = this.dbConnection.getClient();
  }

  async getOpenRequest (sellerId : number) {

    const [request] = await this.db('book_request')
      .select('book_request.*', 'seller.name as sellerName')
      .leftJoin('seller', 'seller.id', 'book_request.sellerId')
      .where({sellerId, isClosed: false})
    
    return request
  }

  async getRequest (id : number) {

    const [request] = await this.db('book_request')
      .select('book_request.*', 'seller.name as sellerName')
      .leftJoin('seller', 'seller.id', 'book_request.sellerId')
      .where({'book_request.id': id})
    
    return request
  }

  async getRequests (sellerId : number) {

    return await this.db('book_request')
      .select('book_request.*', 'seller.name as sellerName')
      .leftJoin('seller', 'seller.id', 'book_request.sellerId')
      .where({sellerId})    
  }

  async insertNewRequest (sellerId : number, requestDate: Date) {

    const query = this.db('book_request')
      .insert({sellerId, 
        requestDate: requestDate.toISOString(),
        isClosed: false
      })
    
    await query
  }

  async closeRequest (sellerId : number) {
    await this.db('book_request')
      .update({isClosed: true})
      .where({sellerId})
  }
  
  async updateRequest (id: string, request : Request) {
    
    const query = this.db('book_request')
      .update(request)
      .where({id})
    
    return query
  }

}