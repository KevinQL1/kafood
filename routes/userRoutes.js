import express from 'express';
import * as usersController from '../controllers/usersController.js';
import { authMiddleware, checkRole } from '../auth/auth.js';

const router = express.Router();

// Ruta de login (pública)
router.post('/login', usersController.login);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware); // Aplica autenticación para las siguientes rutas

// Ruta de usuarios (solo Administradores)
router.get('/users', checkRole(['Administrador']), usersController.getUsers);

// Ruta para obtener un usuario por ID (solo Administradores y Soporte)
router.get('/users/:id', checkRole(['Administrador', 'Soporte']), usersController.getUserById);

// Ruta para crear un nuevo usuario (solo Administradores)
router.post('/users', checkRole(['Administrador']), usersController.createUser);

// Ruta para actualizar un usuario por ID
router.put('/users/:id', usersController.updateUser); // Puede ser accesible para usuarios autenticados

// Ruta para eliminar un usuario por ID (solo Administradores)
router.delete('/users/:id', checkRole(['Administrador']), usersController.deleteUser);

export default router;
