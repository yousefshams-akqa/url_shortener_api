const logger = require("./middleware/logger")
const router = require("./routes/core_routes")
const express = require("express")
const cors = require("cors")
const constants = require("./constants/constants")
const routes = require("./constants/routes")
const app = express()
const port = constants.PORT

app.use(cors())
app.use(express.json())
app.use(logger)
app.use(routes.base, router)

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})