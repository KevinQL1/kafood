import express from 'express';
import { authMiddleware, checkRole } from '../auth/auth.js';
import * as rolesController from '../controllers/rolesController.js';

const router = express.Router();

router.use(authMiddleware);

// El manejo de los roles solo tiene autorización el administrador
router.get('/roles', checkRole(['Administrador']), rolesController.getRoles);
router.get('/roles/:id', checkRole(['Administrador']), rolesController.getRoleById);
router.post('/roles', checkRole(['Administrador']), rolesController.createRole);
router.put('/roles/:id', checkRole(['Administrador']), rolesController.updateRole);
router.delete('/roles/:id', checkRole(['Administrador']), rolesController.deleteRole);

export default router;
