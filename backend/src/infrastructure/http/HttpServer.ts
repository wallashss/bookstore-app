
import http from 'http'
import express from 'express'
import cors from 'cors'

export default class HttpServer {
  app: express.Express
  server: http.Server
  routers : express.Router[]

  constructor (
    private readonly host: string, 
    private readonly port: number
  ) {
    this.app = express()
    this.routers = [];
  }

  addRouter (router : express.Router) {
    this.routers.push(router)
  }

  async start (): Promise<http.Server> {
    
    this.server = this.app.listen(this.port, this.host, () => {
      console.info(`HTTP server running on ${this.port}`)
    })

    this.app.use(express.json({ limit: '100mb' }))
    this.app.use(express.raw({ limit: '100mb' }))
    this.app.use(express.text({ limit: '100mb' }))
    this.app.use(cors())

    this.routers.forEach(r => {
      this.app.use('/api', r)
    })
    
    this.app.use(express.static('web'))
    this.app.use('/*',express.static('web'))
    

    return this.server
  }

  

  async shutdown (): Promise<void> {
    return await new Promise((resolve) => {
      this.server.close(() => {
        resolve()
      })
    })
  }
}
