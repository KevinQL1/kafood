// /routes/orderRoutes.js
import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para pedidos
router.get('/orders', checkRole(['Administrador', 'Soporte']), orderController.getOrders); // Obtener todos los pedidos de todos los usuarios
router.get('/orders/:id', orderController.getOrderById); // Obtener pedido por ID
router.get('/orders/user/:id', orderController.getOrdersByUserId); //Obtener todas las ordenes de 1 usuario
router.post('/orders', checkRole(['Cliente']), orderController.createOrder); // Crear nuevo pedido
router.put('/orders/:id', checkRole(['Cliente']), orderController.updateOrder); // Actualizar pedido por ID
router.delete('/orders/:id', checkRole(['Administrador', 'Soporte', 'Cliente']), orderController.deleteOrder); // Eliminar pedido por ID

export default router;