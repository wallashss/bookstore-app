
import HttpServer from '../infrastructure/http/HttpServer'
import BooksController from '../controllers/BooksController'
import LoginController from '../controllers/LoginController'
import DBConnection from '../infrastructure/db/DBConnection';
import BooksRepository from '../repositories/BooksRepository';
import UsersRepository from '../repositories/UsersRepository';

import env from './env'
import RequestRepository from '../repositories/RequestRepository';
import RequestControler from '../controllers/RequestController';
import RequestItemController from '../controllers/RequestItemController';
import RequestItemRepository from '../repositories/RequestItemRepository';
import UserControler from '../controllers/UserController';
import InfoControler from '../controllers/InfoController';
import QueryController from '../controllers/QueryController';
import PendingBookRepository from '../repositories/PendingBookRepository';
import PendingController from '../controllers/PendingController';
import RequestPdfService from '../services/RequestPdfService';
import PendingBooksPdfService from '../services/PendingBooksPdfService';
import PublisherRepository from '../repositories/PublisherRepository'
import ServerInfoService from '../services/ServerInfoService'
import publishPage from '../infrastructure/s3/PublishPage'

async function main() {

  const dbConnection = new DBConnection();
  const booksRepo = new BooksRepository(dbConnection);

  const usersRepo = new UsersRepository(dbConnection);
  const requestRepo = new RequestRepository(dbConnection)
  const requestItemRepo = new RequestItemRepository(dbConnection)
  const pendingBookRepo = new PendingBookRepository(dbConnection)
  const publisherRepo = new PublisherRepository(dbConnection)
  const serverInfoService = new ServerInfoService()

  const requestPdfService = new RequestPdfService(requestRepo, requestItemRepo)
  const pendingBooksPdfService = new PendingBooksPdfService(pendingBookRepo, publisherRepo)

  const httpServer = new HttpServer(env.host, env.port);
  new BooksController(httpServer, booksRepo)
  new UserControler(httpServer, usersRepo)
  new LoginController(httpServer, usersRepo)
  new RequestControler(httpServer, requestRepo, requestItemRepo, pendingBookRepo, requestPdfService)
  new RequestItemController(httpServer, requestItemRepo)
  new PendingController(httpServer, pendingBookRepo, pendingBooksPdfService)
  new InfoControler(httpServer, serverInfoService, env.port)
  new QueryController(httpServer, dbConnection)
  await httpServer.start()

  publishPage(env.page.bucket, 
    env.page.key,
    env.port,
    serverInfoService).then(() => {

  })
  .catch(err => {
    console.log(err)
  })
}

main()
.then(() => console.log("Application Start Up"))
.catch(err => console.log(err))