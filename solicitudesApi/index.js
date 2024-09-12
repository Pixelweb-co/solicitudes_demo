const express = require('express');
const dotenv = require('dotenv');
const passport = require('./config/passport');
const { sequelize } = require('./models'); // Importa la instancia de sequelize configurada
const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/empleados.routes');
const solicitudRoutes = require('./routes/solicitudes.routes');
const usuarioRoutes = require('./routes/usuarios.routes');
const cors = require('cors');

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Asegúrate de tener esto para manejar JSON
app.use(express.urlencoded({ extended: true })); // Manejar datos URL-encoded
app.use(passport.initialize());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', employeeRoutes);
app.use('/api', solicitudRoutes);
app.use('/api', usuarioRoutes);

// Sincronizar modelos con la base de datos
sequelize.sync({ force: true }) // Usa 'force: true' solo en desarrollo para recrear las tablas
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => console.error('Error synchronizing the database:', err));

  // Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//Pruebas 
module.exports = app;