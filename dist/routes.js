"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ServicesController_1 = __importDefault(require("./src/controllers/ServicesController"));
const ConnectionsController_1 = __importDefault(require("./src/controllers/ConnectionsController"));
const routes = express_1.default.Router();
const servicesControllers = new ServicesController_1.default();
const connectionsController = new ConnectionsController_1.default();
routes.post("/services", servicesControllers.create);
routes.get("/services", servicesControllers.index);
routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);
exports.default = routes;
