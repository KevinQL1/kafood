// /routes/productRoutes.js
import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as productController from '../controllers/productController.js';
const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para productos
router.get('/products', checkRole(['Administrador', 'Soporte', 'Cliente']), productController.getProducts); // Obtener todos los productos
router.get('/products/:id', checkRole(['Administrador', 'Soporte', 'Cliente']), productController.getProductById); // Obtener producto por ID
router.post('/products', checkRole(['Administrador', 'Soporte']), productController.createProduct); // Crear nuevo producto
router.put('/products/:id', checkRole(['Administrador', 'Soporte']), productController.updateProduct); // Actualizar producto por ID
router.delete('/products/:id', checkRole(['Administrador', 'Soporte']), productController.deleteProduct); // Eliminar producto por ID

export default router;