const express = require("express");
const session = require("express-session")
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const maps = require("./games.json");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: 'una stringa segreta',
    resave: false, 
    saveUninitialized: false
}));

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    
    if (!username || !password) {
        return res.status(400).send("Username e password sono obbligatori");
    }

    
    const user = db.prepare(`
        SELECT *
        FROM users
        WHERE username = ?
    `).get(username);

    
    if (!user) {
        return res.status(401).send("Username o password non corretti");
    }

    
    if (password !== user.password_hash) {
        return res.status(401).send("Username o password non corretti");
    }

    
    req.session.userId = user.id;
    req.session.username = user.username;

    
    res.redirect("/index.html");
});

app.get("/api/me", (req, res) => {

    // Controlliamo se esiste una sessione con un utente
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Utente non autenticato"
        });
    }

    
    const user = db.prepare(`
        SELECT id, username
        FROM users
        WHERE id = ?
    `).get(req.session.userId);

    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Utente non trovato"
        });
    }

    
    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username
        }
    });
});

// ===== LOGOUT =====

app.post("/logout", (req, res) => {

    // Distrugge la sessione
    req.session.destroy((err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Errore durante il logout"
            });
        }

        // Logout riuscito
        res.json({
            success: true,
            message: "Logout effettuato"
        });

    });

});



app.get("/api/games", (req, res) => {
    res.json({
        success: true,
        games: maps
    });
});


app.get("/api/games/:id", (req, res) => {
    const { id } = req.params;

    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
        return res.status(400).json({
            success: false,
            message: "L'id deve essere un numero intero"
        });
    }

    const game = maps.find(g => g.index === numericId);

    if (!game) {
        return res.status(404).json({
            success: false,
            message: "Gioco non trovato"
        });
    }

    res.json({
        success: true,
        game
    });
});

// =====================================================
// I MIEI GIOCHI - LISTA
// =====================================================

app.get("/api/my-games", (req, res) => {

    // Controlliamo che l'utente sia loggato
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Devi essere loggato"
        });
    }

    // Recuperiamo gli ID dei giochi dell'utente
    const userGames = db.prepare(`
        SELECT game_index
        FROM user_games
        WHERE user_id = ?
        ORDER BY added_at DESC
    `).all(req.session.userId);

    // Trasformiamo gli ID nei dati completi dei giochi
    const games = userGames
        .map(row => maps.find(game => game.index === row.game_index))
        .filter(game => game !== undefined);

    res.json({
        success: true,
        games
    });

});


// =====================================================
// I MIEI GIOCHI - AGGIUNTA
// =====================================================

app.post("/api/my-games", (req, res) => {

    // Controlliamo che l'utente sia loggato
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Devi essere loggato"
        });
    }

    const { gameId } = req.body;

    // Validazione
    if (!Number.isInteger(gameId)) {
        return res.status(400).json({
            success: false,
            message: "gameId non valido"
        });
    }

    // Controlliamo che il gioco esista
    const game = maps.find(g => g.index === gameId);

    if (!game) {
        return res.status(404).json({
            success: false,
            message: "Gioco non trovato"
        });
    }

    // Controlliamo se è già presente
    const existingGame = db.prepare(`
        SELECT id
        FROM user_games
        WHERE user_id = ?
        AND game_index = ?
    `).get(req.session.userId, gameId);

    if (existingGame) {
        return res.status(409).json({
            success: false,
            message: "Gioco già presente nei tuoi giochi"
        });
    }

    // Inseriamo il gioco
    db.prepare(`
        INSERT INTO user_games (user_id, game_index)
        VALUES (?, ?)
    `).run(req.session.userId, gameId);

    res.status(201).json({
        success: true,
        message: "Gioco aggiunto ai tuoi giochi",
        game
    });

});


app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

   
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username e password sono obbligatori"
        });
    }

    
    const existingUser = db.prepare(`
        SELECT id
        FROM users
        WHERE username = ?
    `).get(username);

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Username già utilizzato"
        });
    }

    
    const result = db.prepare(`
        INSERT INTO users (username, password_hash)
        VALUES (?, ?)
    `).run(username, password);

    res.status(201).json({
        success: true,
        message: "Registrazione completata",
        userId: result.lastInsertRowid
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint non trovato."
    });
});

// 500 — gestione errori generici (middleware con 4 argomenti obbligatorio per Express)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Errore interno del server"
    });
});

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta:${PORT}`);
});