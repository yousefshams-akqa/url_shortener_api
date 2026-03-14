const winstonLogger = require("../services/logger")

function logger(req, res, next) {
    const startTime = Date.now()
    const { method, url, body: requestBody } = req

    // Capture response body
    const oldWrite = res.write
    const oldEnd = res.end
    const chunks = []

    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk))
        return oldWrite.apply(res, arguments)
    }

    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk))
        }
        return oldEnd.apply(res, arguments)
    }

    res.on("finish", () => {
        const duration = Date.now() - startTime
        const { statusCode } = res
        const responseBody = Buffer.concat(chunks).toString('utf8')

        let parsedResBody
        try {
            parsedResBody = JSON.parse(responseBody)
        } catch (e) {
            parsedResBody = responseBody
        }

        const logData = {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            requestBody,
            responseBody: parsedResBody
        }

        const message = `${method} ${url} ${statusCode} - ${duration}ms`

        if (statusCode >= 400) {
            winstonLogger.error(message, logData)
        } else {
            winstonLogger.info(message, logData)
        }
    })

    next()
}

module.exports = logger