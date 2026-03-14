const router = require("express").Router()
const controller = require("../controllers/core_controllers")
const authController = require("../controllers/auth_controllers")
const routes = require("../constants/routes")
const authMiddleware = require("../middleware/auth_verify")
const validatorMiddleware = require("../middleware/validator")
const registerValidator = require("../validators/register.validator")
const loginValidator = require("../validators/login.validator")

router.get(routes.home, authMiddleware, controller.home)

router.get(routes.health, controller.health)

router.post(routes.shorten, controller.shorten)

router.get(routes.clicks, controller.clicks)

router.post(routes.register, validatorMiddleware(registerValidator), authController.register)

router.post(routes.login, validatorMiddleware(loginValidator), authController.login)

router.get(routes.code, controller.code)


module.exports = router