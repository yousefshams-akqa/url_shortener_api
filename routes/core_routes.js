const router = require("express").Router()
const controller = require("../controllers/core_controllers")
const authController = require("../controllers/auth_controllers")
const routes = require("../constants/routes")
const authMiddleware = require("../middleware/auth_verify")

router.get(routes.home, authMiddleware, controller.home)

router.post(routes.shorten, controller.shorten)

router.get(routes.code, controller.code)

router.get(routes.clicks, controller.clicks)

router.post(routes.register, authController.register)

router.post(routes.login, authController.login)

module.exports = router