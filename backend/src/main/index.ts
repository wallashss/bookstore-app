
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

async function main() {

  const dbConnection = new DBConnection();
  const booksRepo = new BooksRepository(dbConnection);

  const usersRepo = new UsersRepository(dbConnection);
  const requestRepo = new RequestRepository(dbConnection)
  const requestItemRepo = new RequestItemRepository(dbConnection)

  const httpServer = new HttpServer(env.host, env.port);
  const booksController = new BooksController(httpServer, booksRepo)
  const userController = new UserControler(httpServer, usersRepo)
  const loginController = new LoginController(httpServer, usersRepo)
  const requestController = new RequestControler(httpServer, requestRepo, requestItemRepo)
  const requestItemController = new RequestItemController(httpServer, requestItemRepo)
  new InfoControler(httpServer, env.port)
  new QueryController(httpServer, dbConnection)
  await httpServer.start()
  
}

main()
.then(() => console.log("Application Start Up"))
.catch(err => console.log(err))