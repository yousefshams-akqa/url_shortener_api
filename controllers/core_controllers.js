const db = require("../services/db")
const generateShortCode = require("../services/short_code_service")

exports.home = (req, res) => {
    res.json({ message: "Hello world" })
}

exports.shorten = async (req, res) => {
    let url = req.body.url
    console.log(req.body)
    if (!url) {
        return res.status(402).json({ message: "URL is required" })
    }
    console.log(url)

    let short_code = generateShortCode()
    console.log(short_code)

    try {
        await db`
            INSERT INTO urls (original_url, short_code)
            VALUES (${url}, ${short_code})
        `

        return res.status(200).json({ "short_code": short_code })
    } catch (error) {
        return res.status(400).json({ message: `Database error: ${error.message}` })
    }
}

exports.code = async (req, res) => {
    let code = req.params.code

    try {
        const rows = await db`
            SELECT original_url FROM urls WHERE short_code = ${code} LIMIT 1
        `
        const row = rows[0]

        if (!row) {
            return res.status(404).json({ message: "Url not found" })
        }

        await db`
            UPDATE urls SET click_count = click_count + 1 WHERE short_code = ${code}
        `

        return res.redirect(row.original_url)
    } catch (error) {
        return res.status(404).json({ message: "Url not found" })
    }
}

exports.clicks = async (req, res) => {
    let code = req.params.code

    try {
        const rows = await db`
            SELECT click_count FROM urls WHERE short_code = ${code} LIMIT 1
        `
        const row = rows[0]

        if (!row) {
            return res.status(404).json({ message: "Not found" })
        }

        return res.status(200).json({ message: `Clicks : ${row.click_count}` })
    } catch (error) {
        return res.status(404).json({ message: "Not found" })
    }
}

exports.health = (req, res) => {
    return res.status(200).json({status: "Server is healthy!"})
}