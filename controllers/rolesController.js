import Role from '../schemas/RoleSchema.js';
import { ok, badRequest, serverError, notFound, forbidden } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';

// Obtener el último ID de rol
const getLastRoleId = async () => {
    const lastRole = await Role.findOne({}, {}, { sort: { 'idRol': -1 } });
    return lastRole ? lastRole.idRol : 0;
};

// Obtener todos los roles
export const getRoles = async (req, res) => {
    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const roles = await Role.find();
        logger.info('Roles retrieved successfully');
        return res.status(ok(roles).statusCode).json(ok(roles).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un rol por su ID
export const getRoleById = async (req, res) => {
    const { id } = req.params;
    const idRol = parseInt(id);

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const role = await Role.findOne({ idRol });

        if (!role) {
            logger.error('An error has occurred: Role not found');
            return res.status(notFound({ message: 'Role not found' })(req.path).statusCode)
                .json(notFound({ message: 'Role not found' })(req.path).body);
        }

        logger.info('Role retrieved successfully');
        return res.status(ok(role).statusCode).json(ok(role).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Crear un nuevo rol
export const createRole = async (req, res) => {
    const { rolName } = req.body;

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        // Verificar si el rolName está permitido
        if (!['Cliente', 'Administrador', 'Soporte', 'Repartidor'].includes(rolName)) {
            logger.error('An error has occurred: Role not allowed');
            return res.status(badRequest({ message: 'Role not allowed' })(req.path).statusCode)
                .json(badRequest({ message: 'Role not allowed' })(req.path).body);
        }

        // Verificar si el rol ya existe en la base de datos
        const existingRole = await Role.findOne({ rolName });
        if (existingRole) {
            logger.error(`An error has occurred: Role '${rolName}' already exists`);
            return res.status(badRequest({ message: `Role '${rolName}' already exists` })(req.path).statusCode)
                .json(badRequest({ message: `Role '${rolName}' already exists` })(req.path).body);
        }

        // Obtener el último ID de rol
        const lastRoleId = await getLastRoleId();

        // Crear el nuevo rol con el ID autoincrementado
        const newRole = new Role({ idRol: lastRoleId + 1, rolName });
        await newRole.save();

        logger.info('Role created successfully');
        return res.status(ok(newRole).statusCode).json(ok(newRole).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Actualizar un rol por su ID
export const updateRole = async (req, res) => {
    const { id } = req.params;
    const idRol = parseInt(id);
    const { rolName } = req.body;

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        // Verificar si el rolName está permitido
        if (!['Cliente', 'Administrador', 'Soporte', 'Repartidor'].includes(rolName)) {
            logger.error('An error has occurred: Role not allowed');
            return res.status(badRequest({ message: 'Role not allowed' })(req.path).statusCode)
                .json(badRequest({ message: 'Role not allowed' })(req.path).body);
        }

        const updatedRole = await Role.findOneAndUpdate({ idRol }, { rolName }, { new: true });

        if (!updatedRole) {
            logger.error('An error has occurred: Role not found');
            return res.status(notFound({ message: 'Role not found' })(req.path).statusCode)
                .json(notFound({ message: 'Role not found' })(req.path).body);
        }

        logger.info('Role updated successfully');
        return res.status(ok(updatedRole).statusCode).json(ok(updatedRole).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Eliminar un rol por su ID
export const deleteRole = async (req, res) => {
    const { id } = req.params;
    const idRol = parseInt(id);

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const deletedRole = await Role.findOneAndDelete({ idRol });

        if (!deletedRole) {
            logger.error('An error has occurred: Role not found');
            return res.status(notFound({ message: 'Role not found' })(req.path).statusCode)
                .json(notFound({ message: 'Role not found' })(req.path).body);
        }

        logger.info('Role deleted successfully');
        return res.status(ok({ message: 'Successfully deleted role' }).statusCode)
            .json(ok({ message: 'Successfully deleted role' }).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};
