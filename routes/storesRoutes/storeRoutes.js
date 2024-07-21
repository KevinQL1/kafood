// /routes/storeRoutes.js
import express from 'express';
import { authMiddleware } from '../auth/auth.js';
import * as storeController from '../controllers/storesController/storeController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para tiendas
router.get('/stores', storeController.getStores); // Obtener todas las tiendas
router.get('/stores/:id', storeController.getStoreById); // Obtener tienda por ID
router.post('/stores', storeController.createStore); // Crear nueva tienda
router.put('/stores/:id', storeController.updateStore); // Actualizar tienda por ID
router.delete('/stores/:id', storeController.deleteStore); // Eliminar tienda por ID

export default router;
