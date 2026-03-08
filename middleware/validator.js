
const validatorMiddleware = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    }
    catch (error) {
        return res.status(400).json({
            error: {
                message: error.issues.map(issue => `${issue.path}: ${issue.message}`).join("\t\n")
            }
        })
    }
}

module.exports = validatorMiddleware