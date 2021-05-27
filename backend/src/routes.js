const express = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const ResellerController = require('./controllers/ResellerController');
const ProductController = require('./controllers/ProductController');
const Apagar = require('./controllers/Apagar');

const routes = express.Router();

routes.get('/apagar', Apagar.allUsers);

routes.post('/session', SessionController.login);
routes.put('/session', SessionController.logout);

routes.post('/user', UserController.create);

routes.post('/reseller', ResellerController.create);
routes.delete('/reseller', ResellerController.delete);
routes.get('/reseller', ResellerController.list);

routes.post('/product', ProductController.create);
routes.delete('/product', ProductController.delete);
routes.get('/product', ProductController.list);

module.exports = routes;