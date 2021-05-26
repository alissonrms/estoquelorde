const express = require('express');
const userController = require('./controllers/userController');
const SessionController = require('./controllers/SessionController');
const Apagar = require('./controllers/Apagar');

const routes = express.Router();

routes.get('/apagar', Apagar.allUsers);

routes.post('/session', SessionController.login);
routes.put('/session', SessionController.logout);

routes.post('/user', userController.create);

module.exports = routes;