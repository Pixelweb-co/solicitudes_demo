const db = require('../models');
const Empleado = db.Empleado;


// Crear un empleado
exports.createEmpleado = async (req, res) => {
  const { nombres, apellidos, email, cargo, telefono, fechaNacimiento } = req.body;
   console.log("create emp")
  try {
    const empleado = await Empleado.create({ nombres, apellidos, email, cargo, telefono, fechaNacimiento });
    
    console.log("csn" , empleado)
    
    res.status(201).json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el empleado', error });
  }
};

// Obtener todos los empleados
exports.obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados', error });
  }
};

// Obtener un empleado por ID
exports.obtenerEmpleadoId = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado', error });
  }
};

// Actualizar un empleado
exports.updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, email, cargo, telefono, fechaNacimiento } = req.body;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    await empleado.update({ nombres, apellidos, email, cargo, telefono, fechaNacimiento });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el empleado', error });
  }
};

// Eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    const empleado = await Empleado.findByPk(id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    await empleado.destroy();
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el empleado', error });
  }
};
