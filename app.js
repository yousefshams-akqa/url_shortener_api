const logger = require("./middleware/logger")
const router = require("./routes/core_routes")
const express = require("express")
const constants = require("./constants/constants")
const app = express()
const port = constants.PORT

app.use(express.json())
app.use(logger)
app.use("/api/urls", router)

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})