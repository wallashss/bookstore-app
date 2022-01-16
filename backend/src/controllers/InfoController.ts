
import express from 'express'
import HttpServer from "../infrastructure/http/HttpServer";
import ServerInfoService from '../services/ServerInfoService'

export default class InfoControler {

  constructor(
    private readonly httpServer : HttpServer,
    private readonly serverInfoService: ServerInfoService,
    private readonly serverPort: number,
  ) {
    const router = express.Router()

    router.get('/info', (req, res) => this.getInfo(req, res))
    this.httpServer.addRouter(router)
  }

  async getInfo(req : express.Request, res : express.Response) {

    try {
      const ip = this.serverInfoService.getIp();

      res.json({ip: `${ip}:${this.serverPort}`})
    }
    catch(err){
      console.log(err.message)
      res.status(500).json({message: err.message, name: err.name})
    }
  }


}