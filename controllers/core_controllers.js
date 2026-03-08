const db = require("../services/db")
const generateShortCode = require("../services/short_code_service")

exports.home = (req, res) => {
    res.json({ message: "Hello world" })
}

exports.shorten = (req, res) => {
    let url = req.body.url
    console.log(req.body)
    if (!url) {
        return res.status(402).json({ message: "URL is required" })
    }
    console.log(url)

    let short_code = generateShortCode()
    console.log(short_code)

    db.run(
        `INSERT INTO Urls (original_url, short_code) VALUES (?, ?)`,
        [url, short_code],
        (err) => {
            if (err) {
                res.status(400).json({ message: `Database error: ${err.message}` })
            }
            else {
                res.status(200).json({ "short_code": short_code })
            }
        }
    )
}

exports.code = (req, res) => {
    let code = req.params.code
    db.get(
        `SELECT original_url FROM Urls WHERE short_code = ?`,
        [code],
        (err, row) => {
            if (err) {
                res.status(404).json({ message: "Url not found" })
            }
            else {
                res.redirect(row.original_url)
            }
        }
    )

    db.run(
        `UPDATE Urls SET click_count = click_count + 1 WHERE short_code = ?`,
        [code],
        (err) => {
            if (err) {
                res.status(400).json({ message: `Database error: ${err.message}` })
            }
        }
    )
}

exports.clicks = (req, res) => {
    let code = req.params.code
    db.get(
        "SELECT click_count FROM Urls WHERE short_code = ?",
        [code],
        (err, row) => {
            if(!err) {
                res.status(200).json({message: `Clicks : ${row.click_count}`})
            }
        }
    )
}   