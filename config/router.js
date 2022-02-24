/*
    Nama    :   Eko Ramadhanu Aryputra
*/

// import library
const appRoot = require('app-root-path');
const metadata = require(`${appRoot.path}/app/helpers/metadata`);

module.exports = (app) => { 
    // import database
    
    // imort cors
    const cors = require(`${appRoot.path}/config/cors`);

    // import controller
    const userController = require(`${appRoot.path}/app/controllers/UserController`);
    const loginController = require(`${appRoot.path}/app/controllers/LoginController`);
    // CORS all Endpoint
    app.use(cors);

    // endpoint
    app.use('/user', userController);
    app.use('/login', loginController);

    // check if endpoint not handle by middleware
    app.use((_req, _res, next) => {
        const error = new Error('not found');
        error.status = 404;
        next(error);
    });

    app.use((error, _req, res, _next) => {
        res.status(error.status || 500);
        if (error.status === 404) {
            res.json({
                meta: metadata,
                attribute: {
                    code: '404',
                    message: 'Page Not Found',
                }
            });
        } else {
            console.log(error);
            return res.status(200).json({
                meta:metadata,
                data: {
                    type: 'error',
                    message: error.message,
                }
            });
        }
    });
}