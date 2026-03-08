require('dotenv').config()

const constants = {
    saltRounds : 10,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET : process.env.REFRESH_SECRET,
    PORT: process.env.PORT
}

module.exports = constants