const { Model, DataTypes,Sequelize } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Empleado = sequelize.define("Empleado", {
      nombres: {
        type: Sequelize.STRING,
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cargo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fechaNacimiento: {
        type: Sequelize.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Empleado'
    });
  
    return Empleado;
  };
  