/*
    Nama    :   Eko Ramadhanu Aryputra
    file    :   Create file to run server
*/
const appRoot = require('app-root-path');
const http = require('http');
const app = require(`${appRoot.path}/app.js`);
const dotenv = require('dotenv');
dotenv.config();

// set port server
const port = process.env.PORT;

// run server
const server = http.createServer(app);
server.listen(port);
console.log('listening port: ' + port);