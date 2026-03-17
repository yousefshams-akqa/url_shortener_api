
var jwt = require('jsonwebtoken')

const constants = require("../constants/constants")

function authMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization

        if(!token) {
            return res.status(401).json({message: "Unauthorized"})
        }

        const bearerToken = token.split(" ")[1]
        const payload = jwt.verify(bearerToken, constants.ACCESS_SECRET)

        req.user = {id : payload.id}
        next()
    }
    catch(err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

module.exports = authMiddleware