const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "vapor.db"));

// Attiva le foreign key di SQLite (perché SQLite non applica sempre le foreign key come ci si aspetterebbe)
//Consigliato da ChatGPT
db.pragma("foreign_keys = ON");


db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        game_index INTEGER NOT NULL,
        added_at TEXT DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        UNIQUE (user_id, game_index)
    );
`);

module.exports = db;
