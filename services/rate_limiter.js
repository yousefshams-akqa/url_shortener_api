const rateLimit = require("express-rate-limit")

const maxRequest = 50
const everySeconds = 60 

// global limit
const globalLimiter = rateLimit({
  // max requests per minute (per each IP address)
  max: maxRequest,
  windowMs: everySeconds * 1000,
  standardHeaders: true, 
  legacyHeaders: false
});

module.exports = globalLimiter