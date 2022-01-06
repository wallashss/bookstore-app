import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import PendingBookRepository from "repositories/PendingBookRepository";


export default class PendingController {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly booksRepo : PendingBookRepository
  ) {
    const router = express.Router()

    router.get('/pending', (req, res) => this.getPendingBooks(req, res))
    router.patch('/pending/:id', (req, res) => this.patchPendingBook(req, res))
    this.httpServer.addRouter(router)
  }

  async getPendingBooks(req : express.Request, res : express.Response) {

    try {
      const sellerId = Number(req.query.sellerId) || null;
      const search = req.query.q as string
      const pending = await this.booksRepo.getPendingBooks(sellerId, search);
      res.send(pending)
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }

  async patchPendingBook(req : express.Request, res : express.Response) {

    try {
      const id = Number(req.params.id) || null;
      const {status} = req.body
      await this.booksRepo.updateRequestItemStatus(id, status);
      res.send({status: 'ok'})
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }


}