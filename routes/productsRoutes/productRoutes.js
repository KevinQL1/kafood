// /routes/productRoutes.js
import express from 'express';
import { authMiddleware } from '../auth/auth.js';
import * as productController from '../controllers/productsController/productController.js';
const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para productos
router.get('/products', productController.getProducts); // Obtener todos los productos
router.get('/products/:id', productController.getProductById); // Obtener producto por ID
router.post('/products', productController.createProduct); // Crear nuevo producto
router.put('/products/:id', productController.updateProduct); // Actualizar producto por ID
router.delete('/products/:id', productController.deleteProduct); // Eliminar producto por ID

export default router;
