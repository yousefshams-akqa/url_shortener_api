
const uuid = require("uuid")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const db = require("../services/db")
const constants = require("../constants/constants")

exports.register = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let name = req.body.name

    // Validate email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail  = emailRegex.test(email)
    if(!(email && isValidEmail && password && email.length !== 0 && password.length !==0)) {
        res.status(400).json({message: "Incorrect email or password shapes"})
        return
    }

    // Check if user with same email doesnt already exist
    db.get(
        "SELECT * FROM Users WHERE email = ?",
        [email],
        (err, row) => {
            console.log(row)
            if(err) {
                res.status(400).json({message: `Database error: ${err.cause}`})
                return
            }
            if(row.email === email) {
                res.status(400).json({message: "User already exists"})
                return
            }
        }
    )

    // Generate password hash
    const salt = bcrypt.genSaltSync(constants.saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    let password_hash = bcrypt.hashSync(password, constants.saltRounds);
    const id = uuid.v4()

    // Store password hash in db
    db.run(
        "INSERT INTO Users(email, password_hash, name, id) VALUES(?,?,?,?)",
        [email, password_hash, name, id],
        (result, error) => {
            if(error) {
                res.status(400).json({message: "Database error"})
            }
            else {
                const token = jwt.sign(
                    {id: id},
                    constants.ACCESS_SECRET,
                    { expiresIn: "1d" }
                )

                const refreshToken = jwt.sign(
                    { id: id },
                    constants.REFRESH_SECRET,
                    { expiresIn: "30d" }
                )

                res.status(200).json({
                    message: "User created successfully",
                    token: token,
                    refreshToken
                })
            }
        }
    )
}

exports.login = (req, res) => {
    // Extract email and pass
    let email = req.body.email
    let password = req.body.password

    if(!(email && password && email.length !== 0 && password.length !==0)) {
        return res.status(400).json({message: "Incorrect email or password shapes"})
    }

    // Get password hash from database
    db.get(
        "SELECT password_hash, id FROM Users WHERE email = ?",
        [email],
        (err, row) => {
            if(err) {
                return res.status(400).json({message: "Database error"})
            }

            let passHash = row.password_hash
            // Compare password with password hash through bcrypt
            let isCorrectPass = bcrypt.compareSync(password, passHash)
            if(!isCorrectPass) {
                return res.status(401).json({message: "Incorrect password"})
            }

            // Generate token with jwt.sign
            const tokenExpiresIn = 1
            const token = jwt.sign(
                {id: row.id},
                constants.ACCESS_SECRET,
                { expiresIn: `${tokenExpiresIn}d` }
            )
            const refreshToken = jwt.sign(
                { id: row.id },
                constants.REFRESH_SECRET,
                { expiresIn: "30d" }
            )

            // Send response
            res.status(200).json({
                message: "Login successful",
                token: token,
                refreshToken: refreshToken,
                expiresIn: tokenExpiresIn
            })
        }
    )
}