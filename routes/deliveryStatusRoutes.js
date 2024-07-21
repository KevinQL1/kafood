// /routes/deliveryStatusRoutes.js
import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as deliveryStatusController from '../controllers/deliveryStatusController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para estados de entregas
router.get('/delivery-status', checkRole(['Administrador', 'Soporte']), deliveryStatusController.getDeliveryStatuses); // Obtener todos los estados
router.get('/delivery-status/:id', checkRole(['Administrador']), deliveryStatusController.getDeliveryStatusById); // Obtener estado por ID
router.post('/delivery-status', checkRole(['Administrador']), deliveryStatusController.createDeliveryStatus); // Crear nuevo estado
router.put('/delivery-status/:id', checkRole(['Administrador']), deliveryStatusController.updateDeliveryStatus); // Actualizar estado por ID
router.delete('/delivery-status/:id', checkRole(['Administrador']), deliveryStatusController.deleteDeliveryStatus); // Eliminar estado por ID

export default router;