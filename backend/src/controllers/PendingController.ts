import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import PendingBookRepository from "../repositories/PendingBookRepository";
import PendingBooksPdfService from "services/PendingBooksPdfService";


export default class PendingController {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly booksRepo : PendingBookRepository,
    private readonly pendingPublisherPdfService : PendingBooksPdfService
  ) {
    const router = express.Router()

    router.get('/pending', (req, res) => this.getPendingBooks(req, res))
    router.get('/pending/publishers', (req, res) => this.getPendingPublishers(req, res))
    router.get('/pending/publisher/:id/pdf', (req, res) => this.getPendingPublisherPdf(req, res))
    router.post('/pending/publisher/:id/status', (req, res) => this.postPendingPublisherStatus(req, res))
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

  async getPendingPublisherPdf (req : express.Request, res : express.Response) {

    try {
      const publisherId = Number(req.params.id) || null;
      await this.pendingPublisherPdfService
        .generatePendingPublisherPdf(publisherId, res)
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }
  
  async getPendingPublishers(req : express.Request, res : express.Response) {

    try {
      const pending = await this.booksRepo.getPendingPublishers();
      res.send(pending)
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }

  async postPendingPublisherStatus(req : express.Request, res : express.Response) {

    try {
      const id = Number(req.params.id)
      const {status} = req.body
      await this.booksRepo.updateRequestItemStatusForPublisher(id, status)
      res.send({status: 'ok'})
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