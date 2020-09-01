import express, { response } from 'express';
import ServicesController from './src/controllers/ServicesController';
import ConnectionsController from './src/controllers/ConnectionsController';

const routes = express.Router();
const servicesControllers = new ServicesController();
const connectionsController = new ConnectionsController();


routes.post("/services", servicesControllers.create);
routes.get("/services", servicesControllers.index);

routes.post('/connections', connectionsController.create)
routes.get('/connections', connectionsController.index)

export default routes;