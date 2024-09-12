const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/usuarios', verifyToken, usuariosController.createUsuario);
router.get('/usuarios', verifyToken, usuariosController.obtenerUsuarios);
router.get('/usuarios/:id', verifyToken, usuariosController.obtenerUsuarioId);
router.put('/usuarios/:id', verifyToken, usuariosController.updateUsuario);
router.delete('/usuarios/:id', verifyToken, usuariosController.eliminarUsuario);

module.exports = router;
