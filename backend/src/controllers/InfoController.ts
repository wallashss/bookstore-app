
import {networkInterfaces} from 'os'
import express from 'express'
import HttpServer from "../infrastructure/http/HttpServer";
import UsersRepository from "../repositories/UsersRepository";




export default class InfoControler {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly serverPort: number
  ) {
    const router = express.Router()

    router.get('/info', (req, res) => this.getInfo(req, res))
    this.httpServer.addRouter(router)
  }

  async getInfo(req : express.Request, res : express.Response) {
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object


    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results[name].push(net.address);
          }
      }
    }

    console.log(results)

    const ip = results["en0" ]|| results["eth0"]
    res.json({ip: `${ip[0]}:${this.serverPort}`})
  }


}