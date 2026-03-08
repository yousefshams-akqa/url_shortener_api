const uuid = require('uuid');

function generateShortCode() {
    return uuid.v4()
}

module.exports = generateShortCode
