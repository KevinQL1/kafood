// /routes/customerRoutes.js
import express from 'express';
import { authMiddleware } from '../../auth/auth.js';
import * as customerController from '../../controllers/usersRoutes/customerController.js';

const router = express.Router();

// Ruta para que un nuevo cliente se registre (pública)
router.post('/customers', customerController.createCustomer); // Crear nuevo cliente

// Ruta de login (pública)
router.post('/login', customerController.login);

// Proteger todas las rutas con autenticación
router.use(authMiddleware);

// Rutas para clientes
router.get('/customers', customerController.getCustomers); // Obtener todos los clientes
router.get('/customers/:id', customerController.getCustomerById); // Obtener cliente por ID
router.put('/customers/:id', customerController.updateCustomer); // Actualizar cliente por ID
router.delete('/customers/:id', customerController.deleteCustomer); // Eliminar cliente por ID

export default router;
