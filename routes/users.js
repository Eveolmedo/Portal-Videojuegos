const express = require('express');
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Game = require("../models/Game"); // Para los favoritos
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY || 'clavesecreta123'

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: 'Usuario ya existe' });
    
        const newUser = new User({ username, password });
        await newUser.save();
    
        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

const loginLimiter = rateLimit({
    windowsMs: 10 * 60 * 1000,
    max: 5,
    message: "Demasiados intentos de inicio de sesion, intenta mas tarde"
});

router.post("/login", loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        // Generar token JWT
        const token = jwt.sign({ userId: user._id, name: user.username }, SECRET_KEY, {
            expiresIn: "1d",
        });
  
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: { id: user._id, username: user.username },
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
})

router.put("/:id/favorite/:gameId", authMiddleware, async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId); // Toma el id que viene de la url
        if (!game) return res.status(404).json({ error: "Juego no encontrado" });
  
        const user = await User.findByIdAndUpdate(
        req.user.userId,
        { $addToSet: { favorite: game._id } }, // Evita duplicados
        { new: true }
        ).populate("favorite"); // Reemplaza automaticamente los IDs por los documentos completos que estan referenciados
  
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;