// /routes/adminRoutes.js
import express from 'express';
import { authMiddleware } from '../../auth/auth.js';
import * as adminController from '../../controllers/usersController/adminController.js';

const router = express.Router();

// Ruta de login (pública)
router.post('/login', adminController.login);

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para administradores
router.get('/admins', adminController.getAdmins); // Obtener todos los administradores
router.get('/admins/:id', adminController.getAdminById); // Obtener administrador por ID
router.post('/admins', adminController.createAdmin); // Crear nuevo administrador
router.put('/admins/:id', adminController.updateAdmin); // Actualizar administrador por ID
router.delete('/admins/:id', adminController.deleteAdmin); // Eliminar administrador por ID

export default router;
