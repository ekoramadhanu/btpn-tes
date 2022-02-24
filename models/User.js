const mongoose = require('mongoose');
const appRoot = require('app-root-path');
const  connection=require (`${appRoot.path}/config/datastore`);

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    accountNumber: {
        type: Number,
        required: true,
        index: true,
        unique: true,
    },
    emailAddress: {
        type: String,
        required: true ,
        unique: true,
    },
    identityNumber: {
        type: String,
        required: true ,
        index: true,
        unique: true,
    },
});

userSchema.index({ accountNumber: 1});

module.exports = connection.model('User',userSchema);