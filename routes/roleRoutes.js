import express from 'express';
import * as rolesController from '../controllers/rolesController.js';

const router = express.Router();

router.get('/roles', rolesController.getRoles);
router.get('/roles/:id', rolesController.getRoleById);
router.post('/roles', rolesController.createRole);
router.put('/roles/:id', rolesController.updateRole);
router.delete('/roles/:id', rolesController.deleteRole);

export default router;
