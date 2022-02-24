/*
    Nama    :   Eko Ramadhanu Aryputra
    log     :   create CORS
*/

module.exports = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
}