const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleados.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/empleados', verifyToken, empleadoController.createEmpleado);
router.get('/empleados', verifyToken, empleadoController.obtenerEmpleados);
router.get('/empleados/:id', verifyToken, empleadoController.obtenerEmpleadoId);
router.put('/empleados/:id', verifyToken, empleadoController.updateEmpleado);
router.delete('/empleados/:id', verifyToken, empleadoController.eliminarEmpleado);

module.exports = router;
