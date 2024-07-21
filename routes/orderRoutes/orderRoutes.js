// /routes/orderRoutes.js
import express from 'express';
import { authMiddleware } from '../auth/auth.js';
import * as orderController from '../controllers/ordersController/orderController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para pedidos
router.get('/orders', orderController.getOrders); // Obtener todos los pedidos
router.get('/orders/:id', orderController.getOrderById); // Obtener pedido por ID
router.post('/orders', orderController.createOrder); // Crear nuevo pedido
router.put('/orders/:id', orderController.updateOrder); // Actualizar pedido por ID
router.delete('/orders/:id', orderController.deleteOrder); // Eliminar pedido por ID

export default router;
