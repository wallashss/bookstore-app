import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import BooksRepository from "../repositories/BooksRepository";
import { parse } from 'csv-parse/sync';
import {remove as removeAccents} from 'diacritics'

export default class BooksControler {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly booksRepo : BooksRepository
  ) {
    const router = express.Router()

    router.get('/books', (req, res) => this.getBooks(req, res))
    router.post('/books', (req, res) => this.postBooks(req, res))
    this.httpServer.addRouter(router)
  }

  async getBooks(req : express.Request, res : express.Response) {
    const input = req.query.q as string
    const books = await this.booksRepo.getBooks(input);
    res.send(books)
  }

  async postBooks(req : express.Request, res : express.Response) {

    try {
      const data = req.body;

      const publisherId = req.headers.publisherid as string
      const rows = parse(data, {
        delimiter: '\t',
        columns: true,
      })

      const books = rows.map((row : any) => {

        const price = typeof row.price === 'string' ?
          Number(row.price.replace(',', '.')) :
          row.price
        
        const name = Object.entries(row)
          .filter(([k, v]) => k.trim().startsWith('name'))
          .map(([k,v]) => (v as string).trim())
          .join(' ')
        
        return {
          price,
          name,
          indexName: removeAccents(name),
          publisherCode: row.publisherCode,
          publisherId: row.publisherId || publisherId
        }

      })
      console.log(books.slice(0, 5))
      await this.booksRepo.insertBooks(books);
      res.send({status: 'ok', inserted: books.length})
    }
    catch(err) {
      console.log(err.name, err.message)
      res.status(500).json({message: err.message, name: err.name})
    }
  }


}