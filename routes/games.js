const express = require('express');

const router = express.Router()

const Game = require('../models/Game');

router.get("/", async (req, res) => {
    const games = await Game.find();
    res.json(games);
});

router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id).populate("reviews.user", "name"); 
        if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  
        res.json(game);
    } catch (err) {
        res.status(500).json({ error: "Error al encontrar el juego" });
    }
});

router.post("/", async (req, res) => {
    const newGame = new Game(req.body);
    await newGame.save();
    res.json(newGame);
});

router.post("/games/:id/reviews", async (req, res) => {
    try {
        const { user, comment, rating } = req.body;
        const game = await Game.findById(req.params.id);
  
        if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  
        const newReview = { user, comment, rating };
        game.reviews.push(newReview);
  
        await game.save();
        res.status(201).json({ message: "Resena agregada", reviews: game.reviews });
    } catch (err) {
        res.status(500).json({ error: "Error al agregar una resena" });
    }
});

router.put("/:id", async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(game)
});

router.delete("/:id", async (req, res) => {
    await Game.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Juego eliminado' });
});

module.exports = router