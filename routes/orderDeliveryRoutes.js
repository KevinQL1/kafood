// /routes/deliveryRoutes.js
import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as deliveryController from '../controllers/orderDeliveryController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para entregas
router.get('/delivery', checkRole(['Administrador', 'Soporte']), deliveryController.getDeliveries); // Obtener todas las entregas
router.get('/delivery/:id', deliveryController.getDeliveryById); // Obtener entrega por ID
router.post('/delivery', checkRole(['Cliente', 'Repartidor']), deliveryController.createDelivery); // Crear nueva entrega
router.put('/delivery/:id',  checkRole(['Administrador', 'Soporte', 'Repartidor']),deliveryController.updateDelivery); // Actualizar entrega por ID
router.delete('/delivery/:id', checkRole(['Administrador', 'Soporte', 'Repartidor']), deliveryController.deleteDelivery); // Eliminar entrega por ID

export default router;