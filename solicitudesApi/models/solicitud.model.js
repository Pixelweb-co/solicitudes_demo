const { Model, DataTypes,Sequelize } = require('sequelize');
const { Empleado } = require('.');

module.exports = (sequelize, DataTypes) => {
    class Solicitud extends Sequelize.Model {}
    Solicitud.init({
      fecha: {
        type: DataTypes.DATE,
        allowNull: false
      },
      numero: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false
      },
      empleadoId:{
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Solicitud'
    });
  
    return Solicitud;
  };
  