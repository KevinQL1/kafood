// /routes/dealerRoutes.js
import express from 'express';
import { authMiddleware } from '../../auth/auth.js';
import * as dealerController from '../../controllers/usersRoutes/deliveryController.js';

const router = express.Router();

// Ruta para que un nuevo repartidor se registre (pública)
router.post('/deliverys', dealerController.createDealer); // Crear nuevo repartidor

// Ruta de login (pública)
router.post('/login', usersController.login);

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para repartidores
router.get('/deliverys', dealerController.getDealers); // Obtener todos los repartidores
router.get('/deliverys/:id', dealerController.getDealerById); // Obtener repartidor por ID
router.put('/deliverys/:id', dealerController.updateDealer); // Actualizar repartidor por ID
router.delete('/deliverys/:id', dealerController.deleteDealer); // Eliminar repartidor por ID

export default router;
