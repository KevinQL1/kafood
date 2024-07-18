import Role from '../models/Role.js';
import { ok, badRequest, serverError, notFound, unauthorized } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';

// Obtener todos los roles
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        logger.info('Roles retrieved successfully')
        return res.status(ok(roles).statusCode).json(ok(roles));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un rol por su ID
export const getRoleById = async (req, res) => {
    const { id } = req.params;

    try {
        const role = await Role.findById(id);

        if (!role) {
            logger.error('An error has occurred: Role not found')
            return res.status(notFound(req.path).statusCode).json(notFound(req.path).body);
        }

        logger.info('Role retrieved successfully')
        return res.status(ok(role).statusCode).json(ok(role));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
    const { rolName } = req.body;

    try {
        // Verificar si el rolName está permitido
        if (!['cliente', 'administrador', 'soporte', 'repartidor'].includes(rolName)) {
            logger.error('An error has occurred: Role not allowed')
            return res.status(badRequest('Role not allowed')(req.path).statusCode).json(badRequest('Role not allowed')(req.path).body);
        }

        // Crear el nuevo rol
        const newRole = new Role({ rolName });
        await newRole.save();

        logger.info('Role created successfully')
        return res.status(ok(newRole).statusCode).json(ok(newRole));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Actualizar un rol por su ID
export const updateRole = async (req, res) => {
    const { id } = req.params;
    const { rolName } = req.body;

    try {
        // Verificar si el rolName está permitido
        if (!['cliente', 'administrador', 'soporte', 'repartidor'].includes(rolName)) {
            logger.error('An error has occurred: Role not allowed')
            return res.status(badRequest('Role not allowed')(req.path).statusCode).json(badRequest('Role not allowed')(req.path).body);
        }

        const updatedRole = await Role.findByIdAndUpdate(id, { rolName }, { new: true });
        
        if (!updatedRole) {
            logger.error('An error has occurred: Role not found')
            return res.status(notFound(req.path).statusCode).json(notFound(req.path).body);
        }

        logger.info('Role updated successfully')
        return res.status(ok(updatedRole).statusCode).json(ok(updatedRole));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Eliminar un rol por su ID
export const deleteRole = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            logger.error('An error has occurred: Role not found')
            return res.status(notFound(req.path).statusCode).json(notFound(req.path).body);
        }

        logger.info('Role deleted successfully')
        return res.status(ok({ message: 'Successfully deleted role' }).statusCode).json(ok({ message: 'Successfully deleted role' }));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};
