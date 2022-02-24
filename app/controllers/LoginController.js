// import library used
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const appRoot = require('app-root-path');
dotenv.config();

// import helpers
const metadata = require(`${appRoot.path}/app/helpers/metadata`);

router.post('/', async (req, res, _next) => {
    let code  = '';
    let message = '';
    if (
        req.body.user 
        && req.body.password
    ) {
        try {
            if (req.body.user  !== process.env.USER && req.body.password !== process.env.PASS) {
                message = {
                    meta: metadata,
                    data: {
                        type: 'message',
                        attributes: {
                            message: 'Data User Is Wrong',
                        },
                    },
                };
                code = 200;
            } else {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 7),
                    data: {
                        id: process.env.USER,
                        iat: (new Date()).getTime()
                    }
                }, process.env.JWT_KEY);
                message = {
                    meta: metadata,
                    data: {
                        type: 'token',
                        attributes: {
                            message: token,
                        },
                    },
                };
                code = 200;
            }
        } catch (error) {
            console.log(error);
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Cannot Login',
                    },
                },
            };
            code = 500;
        }
    } else {
        message = {
            meta: metadata,
            data: {
                type: 'message',
                attributes: {},
            },
        };
        code = 400;
        if (!req.body.user) {
            message.data.attributes.user = 'Body user Is Required';
        }
        if (!req.body.password) {
            message.data.attributes.password = 'Body password Is Required';
        }
    }
    return res.status(code).json(message);
});


// create module user controller
module.exports = router;