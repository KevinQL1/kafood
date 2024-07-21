// /routes/deliveryRoutes.js
import express from 'express';
import { authMiddleware } from '../auth/auth.js';
import * as deliveryController from '../controllers/deliveriesController/deliveriesController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para entregas
router.get('/deliveries', deliveryController.getDeliveries); // Obtener todas las entregas
router.get('/deliveries/:id', deliveryController.getDeliveryById); // Obtener entrega por ID
router.post('/deliveries', deliveryController.createDelivery); // Crear nueva entrega
router.put('/deliveries/:id', deliveryController.updateDelivery); // Actualizar entrega por ID
router.delete('/deliveries/:id', deliveryController.deleteDelivery); // Eliminar entrega por ID

export default router;
