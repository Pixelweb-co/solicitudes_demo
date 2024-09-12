const db = require('../models');
const Usuario = db.Usuario;
const bcrypt = require('bcryptjs');

// Crear un Usuario
exports.createUsuario = async (req, res) => {
  const {username,password,email} = req.body;
   console.log("create user")
  try {
    const usuario = await Usuario.create({username,password,email });
    
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};

// Obtener un empleado por ID
exports.obtenerUsuarioId = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'usuario no encontrado' });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

// Actualizar un empleado
exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const {username,password,email,rol} = req.body;
  console.log('role' ,rol)


  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);


  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    
    await usuario.update({username,hashedPassword,email,rol});
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

// Eliminar un usuario
exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'usuario no encontrado' });

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};
