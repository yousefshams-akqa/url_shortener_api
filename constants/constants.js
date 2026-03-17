require('dotenv').config()

const constants = {
    saltRounds : 10,
    DATABASE_URL : process.env.DATABASE_URL,
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET : process.env.REFRESH_SECRET,
    PORT: process.env.PORT || 3000,
}

module.exports = constants