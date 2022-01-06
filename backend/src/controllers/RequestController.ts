import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import RequestRepository from "repositories/RequestRepository";
import RequestItemRepository from "repositories/RequestItemRepository";


export default class RequestControler {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly requestRepo : RequestRepository,
    private readonly requestItemRepo : RequestItemRepository
  ) {
    const router = express.Router()

    router.get('/request', (req, res) => this.getOpenRequest(req, res))
    router.get('/request/:id', (req, res) => this.getRequest(req, res))
    router.get('/requests', (req, res) => this.getRequests(req, res))
    router.post('/close-request', (req, res) => this.postCloseRequest(req, res))
    router.put('/request', (req, res) => this.putRequest(req, res))
    this.httpServer.addRouter(router)
  }

  async getRequest(req : express.Request, res : express.Response) {

    try {

      const requestId = Number(req.params.id as string)
  
      const request = await this.requestRepo.getRequest(requestId);
  
      if(!request) {
        res.sendStatus(404);
        return;
      }
      const books = await this.requestItemRepo.getRequestBooks(request.id)

      res.send({...request, books})
    }
    catch(err) {
      console.log(err);
      res.status(500).json({message: err.message, name: err.name})
    }
  }

  async getOpenRequest(req : express.Request, res : express.Response) {

    try {

      const userId = Number(req.headers.userid as string)
  
      if(!userId) {
        throw new Error('No user id!')
      }
      const request = await this.requestRepo.getOpenRequest(userId);
  
      if(!request) {

        console.log('Creating new Request')
        await this.requestRepo.insertNewRequest(userId, new Date())
        console.log('New Request Created')
        const newRequest = await this.requestRepo.getOpenRequest(userId);
        console.log('Returning new request')
        console.log('New request id: ', newRequest.id)
        res.send(newRequest)  
        return;
      }
      const books = await this.requestItemRepo.getRequestBooks(request.id)

      res.send({...request, books})
    }
    catch(err) {
      console.log(err);
      res.status(500).json({message: err.message, name: err.name})
    }
  }

  async postCloseRequest(req : express.Request, res : express.Response) {
    const userId = Number(req.headers.userid as string)
  
    if(!userId) {
      throw new Error('No user id!')
    }
    await this.requestRepo.closeRequest(userId);
    res.json({status: 'ok'})
  }

  async getRequests(req : express.Request, res : express.Response) {

    try {

      const userId = Number(req.query.userId as string)
      const search = req.query.q as string
      const all = Number(req.query.all) === 1
      if(!userId) {
        throw new Error('No user id!')
      }

      const requests = await this.requestRepo.getSellerRequests(userId, all, search);
      res.json(requests)
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }

  async putRequest(req : express.Request, res : express.Response) {
    try {

      const {id, ...request} = req.body;
  
      await this.requestRepo.updateRequest(id, request);
      res.json({status: 'ok'})
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message, name: err.name})
    }
  }

}