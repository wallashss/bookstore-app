import HttpServer from "../infrastructure/http/HttpServer";
import express from 'express'
import DBConnection from "../infrastructure/db/DBConnection";

export default class QueryController {


  constructor(
    private readonly httpServer : HttpServer,
    private readonly dbConnection : DBConnection
  ) {
    const router = express.Router()

    router.post('/query', (req, res) => this.postQuery(req, res))
    this.httpServer.addRouter(router)
  }

  async postQuery(req : express.Request, res : express.Response) {
    
    try {

      const query = req.body;
      const db = this.dbConnection.getClient();
  
      const rows : any[] = await db.raw(query)
  
      if(rows.length > 0) {
        const out = [
          Object.keys(rows[0]).join('\t'),
          ...rows.map(r => Object.values(r).join('\t'))
        ]
        res.send(out.join('\n'))
      }
      else {
        res.send('Empty')
      }
    }
    catch(err) {
      console.log(err)
      res.status(500).json({message: err.message})

    }
  }


}