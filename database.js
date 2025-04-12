const mongoose = require('mongoose');

require('dotenv').config()

const connectDB = async () => {
    try {
        // Intentamos estableces la conexion con la DB
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'gestionVideosjuegos', // Se guardaba en la base de datos test, entonces force la conexion
        });
        console.log("Conectado con MongoDB");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;