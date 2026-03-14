
const uuid = require("uuid")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const db = require("../services/database")
const constants = require("../constants/constants")

exports.register = async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let name = req.body.name

    // Validate email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email)
    if (!(email && isValidEmail && password && email.length !== 0 && password.length !== 0)) {
        return res.status(400).json({ message: "Incorrect email or password shapes" })
    }

    try {
        // Check if user with same email doesnt already exist
        const existingUser = await db`
            SELECT email FROM users WHERE email = ${email} LIMIT 1
        `

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" })
        }

        // Generate password hash
        let password_hash = bcrypt.hashSync(password, constants.saltRounds);
        const id = uuid.v4()

        // Store password hash in db
        await db`
            INSERT INTO users(email, password_hash, name, id)
            VALUES(${email}, ${password_hash}, ${name}, ${id})
        `

        const token = jwt.sign(
            { id: id },
            constants.ACCESS_SECRET,
            { expiresIn: "1d" }
        )

        const refreshToken = jwt.sign(
            { id: id },
            constants.REFRESH_SECRET,
            { expiresIn: "30d" }
        )

        return res.status(201).json({
            message: "User created successfully",
            token: token,
            refreshToken
        })
    } catch (error) {
        return res.status(400).json({ message: `Database error: ${error.message}` })
    }
}

exports.login = async (req, res) => {
    // Extract email and pass
    let email = req.body.email
    let password = req.body.password

    if (!(email && password && email.length !== 0 && password.length !== 0)) {
        return res.status(400).json({ message: "Incorrect email or password shapes" })
    }

    try {
        // Get password hash from database
        const rows = await db`
            SELECT password_hash, id FROM users WHERE email = ${email} LIMIT 1
        `
        const row = rows[0]

        if (!row) {
            return res.status(400).json({ message: "Incorrect email or password" })
        }

        // Compare password with password hash through bcrypt
        let passHash = row.password_hash
        let isCorrectPass = bcrypt.compareSync(password, passHash)
        if (!isCorrectPass) {
            return res.status(401).json({ message: "Incorrect password" })
        }

        // Generate token with jwt.sign
        const tokenExpiresIn = 1
        const token = jwt.sign(
            { id: row.id },
            constants.ACCESS_SECRET,
            { expiresIn: `${tokenExpiresIn}d` }
        )
        const refreshToken = jwt.sign(
            { id: row.id },
            constants.REFRESH_SECRET,
            { expiresIn: "30d" }
        )

        // Send response
        return res.status(200).json({
            message: "Login successful",
            token: token,
            refreshToken: refreshToken,
            expiresIn: tokenExpiresIn
        })
    } catch (error) {
        return res.status(400).json({ message: `Database error: ${error.message}` })
    }
}