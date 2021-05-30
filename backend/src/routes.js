const express = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const ResellerController = require('./controllers/ResellerController');
const ProductController = require('./controllers/ProductController');
const EntryProductController = require('./controllers/EntryProductController');
const ExpenseController = require('./controllers/ExpenseController');
const SellingController = require('./controllers/SellingController');

const Apagar = require('./controllers/Apagar');

const routes = express.Router();

routes.get('/apagar', Apagar.allUsers);

routes.post('/session', SessionController.login);
routes.put('/session', SessionController.logout);

routes.post('/user', UserController.create);

routes.post('/reseller', ResellerController.create);
routes.delete('/reseller', ResellerController.delete);
routes.get('/reseller', ResellerController.list);
routes.put('/reseller', ResellerController.update);

routes.post('/product', ProductController.create);
routes.delete('/product', ProductController.delete);
routes.get('/product', ProductController.list);
routes.put('/product', ProductController.update);

routes.post('/entryproduct', EntryProductController.create);
routes.delete('/entryproduct', EntryProductController.delete);
routes.get('/entryproduct', EntryProductController.list);
routes.put('/entryproduct', EntryProductController.update);

routes.post('/expense', ExpenseController.create);
routes.delete('/expense', ExpenseController.delete);
routes.get('/expense', ExpenseController.list);
routes.put('/expense', ExpenseController.update);

routes.post('/selling', SellingController.create);
routes.delete('/selling', SellingController.delete);

module.exports = routes;