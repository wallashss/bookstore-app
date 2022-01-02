import express from 'express'
import HttpServer from "../infrastructure/http/HttpServer";
import UsersRepository from "../repositories/UsersRepository";

export default class LoginControler {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly usersRepo : UsersRepository
  ) {
    const router = express.Router()

    router.post('/login', (req, res) => this.login(req, res))
    this.httpServer.addRouter(router)
  }

  async login(req : express.Request, res : express.Response) {
    try {
      
      const {username, password} = req.body
  
      const user = await this.usersRepo.login(username, password)
  
      if(user) {
        res.status(200).json(user)
      }
      else {
        res.sendStatus(401)
      }
    }
    catch(err) {
      console.log(err.message)
      res.status(500).json({message: err.message, name: err.name})
    }
    
  }


}