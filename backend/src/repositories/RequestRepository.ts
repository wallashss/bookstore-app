
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

  async getSellerRequests (sellerId : number, all : boolean, search : string) {

    const subquery = this.db('book_request_item')
          .count('*')
          .where('book_request_item.requestId', '=', this.db.ref('book_request.id'))
          .as('bookCount')

    const mainQuery = this.db('book_request')
      .select(
        'book_request.*', 
        'seller.name as sellerName',
        subquery
      )
      .leftJoin('seller', 'seller.id', 'book_request.sellerId')
      .andWhere('book_request.isClosed', '=', true)
      
    const query = all ?
      mainQuery :
      mainQuery.where({sellerId})

    return search ? 
      query.where('book_request.client', 'like', `%${search}%`) :
      query

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