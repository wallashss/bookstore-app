import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import BookRequestRepository from "repositories/RequestItemRepository";


export default class RequestItemController {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly booksRepo : BookRequestRepository
  ) {
    const router = express.Router()

    router.post('/request/item', (req, res) => this.postRequestItem(req, res))
    router.delete('/request/item/:id', (req, res) => this.deleteRequestItem(req, res))
    this.httpServer.addRouter(router)
  }

  async postRequestItem(req : express.Request, res : express.Response) {

    try {
      const data = req.body;
      await this.booksRepo.addItem(data);
      res.send({status: 'ok'})
    }
    catch(err) {
      console.log(err)
      res.status(500).json(err)
    }
  }

  async deleteRequestItem(req : express.Request, res : express.Response) {

    try {
      const id = Number(req.params.id);
      await this.booksRepo.removeRequestBook(id);
      res.send({status: 'ok'})
    }
    catch(err) {
      console.log(err)
      res.status(500).json(err)
    }
  }


}