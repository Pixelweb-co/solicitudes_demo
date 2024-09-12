
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Empleado = require('./empleado.model')(sequelize, Sequelize.DataTypes);
db.Solicitud = require('./solicitud.model')(sequelize, Sequelize.DataTypes);
db.Usuario = require('./usuarios.model')(sequelize, Sequelize.DataTypes);

console.log("cargado usuario: ",db.usuario);

// Configura las asociaciones si es necesario

db.Solicitud.belongsTo(db.Empleado, { foreignKey: 'empleadoId', as: 'empleado' });
db.Empleado.hasMany(db.Solicitud, { foreignKey: 'empleadoId', as: 'solicitudes' });


module.exports = db;
