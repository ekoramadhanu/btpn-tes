const jwt = require('jsonwebtoken');
const appRoot = require('app-root-path');
const dotenv = require('dotenv');
dotenv.config();

const metadata = require(`${appRoot.path}/app/helpers/metadata`);

module.exports = (req, res, next) => {
    // initialization 
    const date = new Date();
    let message = '';
    
    try {
        const token = req.headers['authorization'].split(' ');
        if (token[0] !== 'Bearer' || token.length !== 2) {
            return res.status(200).json({
                meta: metadata,
                data: {
                    type: 'message',
                    attributes: {
                        message: 'Header Authorization Not Valid',
                    },
                },
            });
        }
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('error detected: ' + error.message);
        if ( error.message === 'jwt expired' ) {
            message = 'jwt expired';
        } else {
            message = 'Authentication Failed';
        }
        // send json http 200 with message authentication failed
        return res.status(200).json({
            meta: metadata,
            data: {
                type: 'message',
                attributes: {
                    message: message,
                },
            },
        });
    }
}