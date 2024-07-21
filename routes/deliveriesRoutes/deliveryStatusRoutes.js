// /routes/deliveryStatusRoutes.js
import express from 'express';
import { authMiddleware } from '../auth/auth.js';
import * as deliveryStatusController from '../controllers/deliveriesController/deliveryStatusController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para estados de entregas
router.get('/delivery-status', deliveryStatusController.getDeliveryStatuses); // Obtener todos los estados
router.get('/delivery-status/:id', deliveryStatusController.getDeliveryStatusById); // Obtener estado por ID
router.post('/delivery-status', deliveryStatusController.createDeliveryStatus); // Crear nuevo estado
router.put('/delivery-status/:id', deliveryStatusController.updateDeliveryStatus); // Actualizar estado por ID
router.delete('/delivery-status/:id', deliveryStatusController.deleteDeliveryStatus); // Eliminar estado por ID

export default router;
