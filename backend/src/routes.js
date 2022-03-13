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

const cryptography = require('./controllers/utilities/cryptography');
async function authenticate(request, response, next){
    const token = request.headers.authorization;
    const  id_user = request.headers.id_user;
    const auth = await cryptography.authenticate(id_user, token);
    if(auth){
        next()
    }else{
        return response.status(401).json({status: "Operação não permitida"});
    }
}

const routes = express.Router();

routes.get('/apagar', Apagar.allUsers);

routes.post('/session', SessionController.login);
routes.put('/session', SessionController.logout);

routes.post('/user', UserController.create);

routes.post('/reseller', authenticate, ResellerController.create);
routes.delete('/reseller/:reseller_id', authenticate, ResellerController.delete);
routes.get('/reseller', authenticate, ResellerController.list);
routes.put('/reseller', authenticate, ResellerController.update);

routes.post('/product', authenticate, ProductController.create);
routes.delete('/product/:product_id', authenticate, ProductController.delete);
routes.get('/product', authenticate, ProductController.list);
routes.put('/product', authenticate, ProductController.update);

routes.post('/entryproduct', authenticate, EntryProductController.create);
routes.delete('/entryproduct/:entry_product_id', authenticate, EntryProductController.delete);
routes.put('/entryproduct', authenticate, EntryProductController.update);

routes.post('/expense', authenticate, ExpenseController.create);
routes.delete('/expense/:expense_id', authenticate, ExpenseController.delete);
routes.put('/expense', authenticate, ExpenseController.update);

routes.post('/sale', authenticate, saleController.create);
routes.delete('/sale/:id_sale', authenticate, saleController.delete);
routes.put('/sale', authenticate, saleController.update);

routes.get('/installment', authenticate, installmentController.list);
routes.delete('/installment/:id_installment', authenticate, installmentController.delete);

//routes.put('/saleproduct', authenticate, saleProductController.update);

routes.get('/statement-values', authenticate, StatementController.values);
routes.get('/statement-list', authenticate, StatementController.list);

routes.get('/report-product', authenticate, ReportController.product);
routes.get('/report-reseller', authenticate, ReportController.reseller);
routes.get('/report-statement', authenticate, ReportController.list);

module.exports = routes;