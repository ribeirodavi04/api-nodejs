const jwt = require('jsonwebtoken');

const secret = 'e81d1dd01a78ed1de67e13f67a5dddf8';

const sign = payload => jwt.sign(payload, secret, {
    expiresIn: 86400
});
const verify = token => jwt.verify(token, secret);

module.exports = {sign, verify};