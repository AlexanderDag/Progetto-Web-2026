const express = require("express");
const cors = require("cors");
const path = require("path");

const maps = require("./games.json");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());

app.get("/gameIndex", (req, res) => {
    const { gameIndex } = req.query;

    if (!gameIndex) {
        return res.status(400).json({
            success: false,
            message: "Parametro gameIndex mancante"
        });
    }

    const game = maps.find(g => g.index === Number(gameIndex));

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
app.get("/gameList", (req, res) => {

    res.json({
        success: true,
        gameIndexs: Object.keys(maps)
    });

});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint non trovato."
    });
});

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta:${PORT}`);
});
