const router = require("express").Router()
const controller = require("../controllers/core_controllers")
const authController = require("../controllers/auth_controllers")
const routes = require("../constants/routes")
const authMiddleware = require("../middleware/auth_verify")
const validatorMiddleware = require("../middleware/validator")
const registerValidator = require("../validators/register.validator")
const loginValidator = require("../validators/login.validator")

/**
 * @swagger
 * /api/urls/:
 *   get:
 *     summary: API Welcome
 *     description: Hello world message.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello world
 */
router.get(routes.home, authMiddleware, controller.home)


/**
 * @swagger
 * /api/urls/health:
 *   get:
 *     summary: Health Check
 *     description: Server status.
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Server is healthy!
 */
router.get(routes.health, controller.health)


/**
 * @swagger
 * /api/urls/shorten:
 *   post:
 *     summary: Shorten URL
 *     description: Create short link.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Short URL created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 short_code:
 *                   type: string
 *                   example: abc123
 *       402:
 *         description: Missing URL
 *       400:
 *         description: Error
 */
router.post(routes.shorten, controller.shorten)


/**
 * @swagger
 * /api/urls/stats/{code}:
 *   get:
 *     summary: Get Clicks
 *     description: Clicks frequency.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Click stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clicks : 5"
 *       404:
 *         description: Code not found
 */
router.get(routes.clicks, controller.clicks)


/**
 * @swagger
 * /api/urls/register:
 *   post:
 *     summary: User Registration
 *     description: New account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post(routes.register, validatorMiddleware(registerValidator), authController.register)


/**
 * @swagger
 * /api/urls/login:
 *   post:
 *     summary: User Login
 *     description: Authenticate user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 *                   example: 1
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Invalid credentials
 */
router.post(routes.login, validatorMiddleware(loginValidator), authController.login)


/**
 * @swagger
 * /api/urls/{code}:
 *   get:
 *     summary: Redirect URL
 *     description: Forwarding link.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: Code not found
 */
router.get(routes.code, controller.code)



module.exports = router