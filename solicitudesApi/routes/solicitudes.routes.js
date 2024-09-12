const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudes.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/solicitudes', verifyToken, solicitudController.createSolicitud);
router.get('/solicitudes', verifyToken, solicitudController.getSolicitudes);
router.get('/solicitudes/:id', verifyToken, solicitudController.getSolicitudById);
router.put('/solicitudes/:id', verifyToken, solicitudController.updateSolicitud);
router.delete('/solicitudes/:id', verifyToken, solicitudController.deleteSolicitud);

module.exports = router;
