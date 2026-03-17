const logger = require("./middleware/logger")
const router = require("./routes/core_routes")
const express = require("express")
const cors = require("cors")
const constants = require("./constants/constants")
const routes = require("./constants/routes")
const app = express()
const rateLimitter = require("./services/rate_limiter")
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./services/swagger_config");
const port = constants.PORT

app.use(cors())
app.use(rateLimitter)
app.use(express.json())
app.use(logger)
app.use(routes.base, router)
app.use(routes.docs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})