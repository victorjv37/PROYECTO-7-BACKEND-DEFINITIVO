const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db'); // esto lo creamos después

// cargamos las variables de entorno
dotenv.config();

// rutas
const teams = require('./src/routes/teams');
const players = require('./src/routes/players');
const auth = require('./src/routes/auth');
const users = require('./src/routes/users');

// conectamos a la base de datos
connectDB();

const app = express();

// middleware para parsear el body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ruta básica
app.get('/', (req, res) => {
  res.send('API is running...');
});

// montamos las rutas
app.use('/api/v1/teams', teams);
app.use('/api/v1/players', players);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// rutas que añadiremos después
// app.use('/api/v1/authors', require('./src/routes/authors'));
// app.use('/api/v1/books', require('./src/routes/books'));


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// manejamos los errores no controlados
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // cerramos el servidor y salimos
  server.close(() => process.exit(1));
}); 