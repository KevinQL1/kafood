// /routes/supportRoutes.js
import express from 'express';
import { authMiddleware } from '../../auth/auth.js';
import * as supportController from '../../controllers/usersRoutes/supportController.js';

const router = express.Router();

// Ruta de login (pública)
router.post('/login', supportController.login);

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para soporte
router.get('/supports', supportController.getSupports); // Obtener todos los soportes
router.get('/supports/:id', supportController.getSupportById); // Obtener soporte por ID
router.post('/supports', supportController.createSupport); // Crear nuevo soporte
router.put('/supports/:id', supportController.updateSupport); // Actualizar soporte por ID
router.delete('/supports/:id', supportController.deleteSupport); // Eliminar soporte por ID

export default router;
