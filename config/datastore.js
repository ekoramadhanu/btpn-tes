const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connection =  mongoose.createConnection(
    process.env.DB_CONNECTION,
    {
        autoIndex: false,
        maxPoolSize: 10, 
        serverSelectionTimeoutMS: 5000, 
        socketTimeoutMS: 45000, 
        family: 4 
    }
);

module.exports =  connection;