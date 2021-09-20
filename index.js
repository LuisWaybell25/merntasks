const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// Crear el servidor
const app = express();

// Conectar a la bd
conectarDB();

// Habilitar cors
app.use(cors());

// Habilitar express.json para leer datos que el usuario coloque
app.use(express.json({ extended: true }));

// Puerto de la app
const port = process.env.port || 4000; // Cliente 3000 y servidor 4000

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor puerto ${port}`);
})
