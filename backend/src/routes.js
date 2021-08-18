const express = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const ResellerController = require('./controllers/ResellerController');
const ProductController = require('./controllers/ProductController');
const EntryProductController = require('./controllers/EntryProductController');
const ExpenseController = require('./controllers/ExpenseController');
const saleController = require('./controllers/saleController');
const saleProductController = require('./controllers/saleProductController');
const StatementController = require('./controllers/StatementController');
const ReportController = require('./controllers/ReportController');

const Apagar = require('./controllers/Apagar');
const installmentController = require('./controllers/installmentController');

const routes = express.Router();

routes.get('/apagar', Apagar.allUsers);

routes.post('/session', SessionController.login);
routes.put('/session', SessionController.logout);

routes.post('/user', UserController.create);

routes.post('/reseller', ResellerController.create);
routes.delete('/reseller/:reseller_id', ResellerController.delete);
routes.get('/reseller', ResellerController.list);
routes.put('/reseller', ResellerController.update);

routes.post('/product', ProductController.create);
routes.delete('/product/:product_id', ProductController.delete);
routes.get('/product', ProductController.list);
routes.put('/product', ProductController.update);

routes.post('/entryproduct', EntryProductController.create);
routes.delete('/entryproduct/:entry_product_id', EntryProductController.delete);
routes.put('/entryproduct', EntryProductController.update);

routes.post('/expense', ExpenseController.create);
routes.delete('/expense/:expense_id', ExpenseController.delete);
routes.put('/expense', ExpenseController.update);

routes.post('/sale', saleController.create);
routes.delete('/sale/:id_sale', saleController.delete);
routes.put('/sale', saleController.update);

routes.get('/installment', installmentController.list);
routes.delete('/installment/:id_installment', installmentController.delete);

routes.put('/saleproduct', saleProductController.update);

routes.get('/statement-values', StatementController.values);
routes.get('/statement-list', StatementController.list);

routes.get('/report-product', ReportController.product);
routes.get('/report-reseller', ReportController.reseller);
routes.get('/report-statement', ReportController.list);

module.exports = routes;