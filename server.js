const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const maps = require("./games.json");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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