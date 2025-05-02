const express = require('express');
const connectDB = require('./database')
const gamesRoute = require('./routes/games')
const authRoute = require('./routes/users')
const path = require('path');

require('dotenv').config()

connectDB()

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/games", gamesRoute)
app.use("/", authRoute)

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
})