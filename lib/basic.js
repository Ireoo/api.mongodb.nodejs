const crypto = require('crypto');


exports.md5 = (text) => {
    let type = arguments[1] || 'hex';
    return crypto.createHash('md5').update(text).digest(type);
};

exports.getIP = (req) => {
    return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).substr(7);
};
