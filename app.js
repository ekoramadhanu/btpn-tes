/*
    Nama    :   Eko Ramadhanu Aryputra
    log     :   19 February 2021 -> make app.js for collection all to run express
    note    :   -
*/

// import library
const appRoot = require('app-root-path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser =  require('body-parser');

// use module
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// use route
const routes = require(`${appRoot.path}/config/router`);
routes(app);

// make variable app visible in another class
module.exports = app;