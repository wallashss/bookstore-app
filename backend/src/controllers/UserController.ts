import express from 'express'
import HttpServer from "../infrastructure/http/HttpServer";
import UsersRepository from "../repositories/UsersRepository";

export default class UserControler {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly usersRepo : UsersRepository
  ) {
    const router = express.Router()

    router.post('/user', (req, res) => this.postUser(req, res))
    this.httpServer.addRouter(router)
  }

  async postUser(req : express.Request, res : express.Response) {
    try {
      const user = req.body
      await this.usersRepo.insertUser(user)
      res.status(201).json({status: 'ok'})
    }
    catch(err) {
      console.log(err)
      res.status(500).json(err)
    }
  }


}