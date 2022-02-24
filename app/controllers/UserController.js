// import library used
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const appRoot = require('app-root-path');
dotenv.config();

// import helper
const metadata = require(`${appRoot.path}/app/helpers/metadata`);

// import models
const dataUser = require(`${appRoot.path}/models/User`);

// import Midlleware
const authorization = require(`${appRoot.path}/app/middlewares/Authoriation`);

router.post('/',authorization, async (req, res, _next) => {
    let code  = '';
    let message = '';
    if (
        req.body.userName 
        && req.body.accountNumber
        && req.body.emailAddress
        && req.body.identityNumber
    ) {
        try {
            const dbEntries = await dataUser.find().lean();
            const dataID = await dataUser.find({ id: req.body.id }).exec();
            const dataUserName = await dataUser.find({ userName: req.body.userName }).exec();
            const dataAccountNumber = await dataUser.find({ accountNumber: req.body.accountNumber }).exec();
            const dataEmailAddress = await dataUser.find({ emailAddress: req.body.emailAddress }).exec();
            const dataIdentityNumber = await dataUser.find({ identityNumber: req.body.identityNumber }).exec();
            if (
                dataID.length > 0 || dataUserName.length > 0 || dataAccountNumber.length > 0
                || dataEmailAddress.length > 0 || dataIdentityNumber.length > 0
            ) {
                message = {
                    meta: metadata,
                    data: {
                        type: 'message',
                        attributes: {
                            message: 'Data User Has Been Created',
                        },
                    },
                };
                code = 200;
            } else {
                const database = new dataUser({
                    id: parseInt(dbEntries.length) + 1,
                    userName: req.body.userName,
                    accountNumber: req.body.accountNumber,
                    emailAddress: req.body.emailAddress,
                    identityNumber: req.body.identityNumber,
                });
                await database.save();
                message = {
                    meta: metadata,
                    data: {
                        type: 'message',
                        attributes: {
                            message: 'Data User Is Successfully Insert',
                        },
                    },
                };
                code = 200;
            }
        } catch (error) {
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Cannot Insert',
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
        if (!req.body.userName) {
            message.data.attributes.userName = 'Body userName Is Required';
        }
        if (!req.body.accountNumber) {
            message.data.attributes.accountNumber = 'Body accountNumber Is Required';
        }
        if (!req.body.emailAddress) {
            message.data.attributes.emailAddress = 'Body emailAddress Is Required';
        }
        if (!req.body.identityNumber) {
            message.data.attributes.identityNumber = 'Body identityNumber Is Required';
        }
    }
    return res.status(code).json(message);
});

router.delete('/:id',authorization, async (req, res, _next) => {
    let code  = '';
    let message = '';
    try {
        const data  = await dataUser.find({ id: req.params.id }).exec();
        if (data.length !== 1) {
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Not Found',
                    },
                },
            };
            code = 200;
        } else {
            await dataUser.deleteOne({ id: req.params.id });
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Is Successfully Deleted',
                    },
                },
            };
            code = 200;
        }
    } catch (error) {
        message = {
            meta: metadata,
            data: {
                type: 'message',
                attributes: {
                    message: 'Data User Cannot Insert',
                },
            },
        };
        code = 500;
    }
    return res.status(code).json(message);
});

router.patch('/:id', authorization, async (req, res, _next) => {
    let code  = '';
    let message = '';
    try {
        const data  = await dataUser.find({ id: req.params.id }).exec();
        const dataUserName = await dataUser.find({ userName: req.body.userName, id: {$ne: req.params.id} }).exec();
        const dataAccountNumber = await dataUser.find({ accountNumber: req.body.accountNumber, id: {$ne: req.params.id} }).exec();
        const dataEmailAddress = await dataUser.find({ emailAddress: req.body.emailAddress, id: {$ne: req.params.id} }).exec();
        const dataIdentityNumber = await dataUser.find({ identityNumber: req.body.identityNumber, id: {$ne: req.params.id} }).exec();
        if (data.length !== 1) {
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Not Found',
                    },
                },
            };
            code = 200;
        }  else if (
            dataUserName.length > 0 || dataAccountNumber.length > 0
            || dataEmailAddress.length > 0 || dataIdentityNumber.length > 0
        ) {
            message = {
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Data User Is Already Exist',
                    },
                },
            };
            code = 200;
        } else {
            const payload = {};
            if (req.body.userName) {
                payload.userName = req.body.userName;
            }
            if (req.body.accountNumber) {
                payload.accountNumber = req.body.accountNumber;
            }
            if (req.body.emailAddress) {
                payload.emailAddress = req.body.emailAddress;
            }
            if (req.body.identityNumber) {
                payload.identityNumber = req.body.identityNumber;
            }
            const update = await dataUser.updateOne({ id: req.params.id },payload);
            if (update.modifiedCount == 1) {
                message = {
                    meta: metadata,
                    data: {
                        type: 'message',
                        attributes: {
                            message: 'Data User Is Successfully updated',
                        },
                    },
                };
            } else {
                message = {
                    meta: metadata,
                    data: {
                        type: 'message',
                        attributes: {
                            message: 'Data User Is Already Exist',
                        },
                    },
                };
            }
            code = 200;
        }
    } catch (error) {
        console.log(error);
        message = {
            meta: metadata,
            data: {
                type: 'message',
                attributes: {
                    message: 'Data User Cannot Updated',
                },
            },
        };
        code = 500;
    }
    return res.status(code).json(message);
});

router.get('/account-number/:id', authorization, async (req, res, _next) => {
    let code  = 200;
    let message = '';
    const dataAccountNumber = await dataUser.find({ accountNumber: req.params.id}).exec();
    message = {
        meta: metadata,
        data: {
            type: 'user',
            attributes: {
                data: dataAccountNumber,
            },
        },
    };
    return res.status(code).json(message);
});

router.get('/', authorization, async (req, res, _next) => {
    let code  = 200;
    let message = '';
    const data = await dataUser.find().exec();
    message = {
        meta: metadata,
        data: {
            type: 'user',
            attributes: {
                data,
            },
        },
    };
    return res.status(code).json(message);
});

router.get('/identity-number/:id', authorization, async (req, res, _next) => {
    let code  = 200;
    let message = '';
    const dataIdentityNumber = await dataUser.find({ identityNumber: {$eq: req.params.id} }).exec();
    message = {
        meta: metadata,
        data: {
            type: 'user',
            attributes: {
                data: dataIdentityNumber,
            },
        },
    };
    return res.status(code).json(message);
});

// create module user controller
module.exports = router;