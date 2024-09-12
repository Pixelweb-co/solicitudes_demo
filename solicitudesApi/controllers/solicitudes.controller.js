const db = require('../models');
const Empleado = db.Empleado;
const Solicitud = db.Solicitud;


// Crear una solicitud
exports.createSolicitud = async (req, res) => {
  const { fecha, descripcion, estado, empleadoId } = req.body;

  try {
    const empleado = await Empleado.findByPk(empleadoId);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });

    const solicitud = await Solicitud.create({ fecha, descripcion, estado, empleadoId });
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la solicitud', error });
  }
};

// Obtener todas las solicitudes con los nombres de los empleados
exports.getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [{
        model: Empleado,
        as: 'empleado', // Alias utilizado en la definición de la relación
        attributes: ['nombres', 'apellidos'] // Seleccionar solo los atributos necesarios
      }]
    });
    
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las solicitudes', error });
  }
};

// Obtener una solicitud por ID
exports.getSolicitudById = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await Solicitud.findByPk(id, {
      include: [{ model: Empleado, attributes: ['nombres', 'apellidos'] }],
    });
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la solicitud', error });
  }
};


// Actualizar una solicitud
exports.updateSolicitud = async (req, res) => {
  const { id } = req.params;
  const { fecha, descripcion, estado, empleadoId } = req.body;

  try {
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    await solicitud.update({ fecha, descripcion, estado, empleadoId });
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la solicitud', error });
  }
};

// Eliminar una solicitud
exports.deleteSolicitud = async (req, res) => {
  const { id } = req.params;

  try {
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ message: 'Solicitud no encontrada' });

    await solicitud.destroy();
    res.json({ message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la solicitud', error });
  }
};
