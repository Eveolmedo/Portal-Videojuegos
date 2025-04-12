const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    createdAt: { type: Date, default: Date.now }
});

const GameSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    release_year: { type: Number, required: true },
    plataforma: { type: String, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [ReviewSchema]
})

// Exportamos un modelo llamado 'Game', que esta basado en el esquema GameSchema
// Un modelo es una clase que nos permite interactuar con la coleccion 'Games' en la base de datos.
module.exports = mongoose.model("Game", GameSchema);