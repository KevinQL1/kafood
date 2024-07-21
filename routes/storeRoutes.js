// /routes/storeRoutes.js
import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as storeController from '../controllers/storeController.js';

const router = express.Router();

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para tiendas
router.get('/stores', checkRole(['Administrador', 'Soporte', 'Cliente']), storeController.getStores); // Obtener todas las tiendas
router.get('/stores/:id', checkRole(['Administrador', 'Soporte', 'Cliente']), storeController.getStoreById); // Obtener tienda por ID
router.post('/stores', checkRole(['Administrador', 'Soporte']), storeController.createStore); // Crear nueva tienda
router.put('/stores/:id', checkRole(['Administrador', 'Soporte']), storeController.updateStore); // Actualizar tienda por ID
router.delete('/stores/:id', checkRole(['Administrador', 'Soporte']), storeController.deleteStore); // Eliminar tienda por ID

export default router;