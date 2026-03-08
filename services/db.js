const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
    'url_database.sqlite3',
    (err) => {
        console.log(err ? err.message : "✅ Connected to the database.")
    }
)

module.exports = db