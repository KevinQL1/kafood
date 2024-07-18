import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { ok, badRequest, notFound, serverError, unauthorized } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';
import Role from '../models/Role.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        logger.info('Users retrieved successfully')
        return res.status(ok(users).statusCode).json(ok(users));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            logger.error('An error has occurred: User not found')
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode).json(notFound({ message: 'User not found' })(req.path).body);
        }
        logger.info('User retrieved successfully')
        return res.status(ok(user).statusCode).json(ok(user));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { username, email, password, rol } = req.body;

    try {
        // Verificar si el rol existe
        const existingRole = await Role.findById(rol);
        if (!existingRole) {
            logger.error('An error has occurred: The specified role does not exist')
            return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        logger.info('User created successfully')
        return res.status(ok(newUser).statusCode).json(ok(newUser));
    } catch (error) {
        if (error.code === 11000) {
            logger.error(`An error has occurred: ${error.message}`)
            return res.status(badRequest({ message: 'Username or email already exists' })(req.path).statusCode).json(badRequest({ message: 'Username or email already exists' })(req.path).body);
        }
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, rol } = req.body;
    try {
        let updatedFields = { username, email };

        // Verificar y cifrar la nueva contraseña si se proporciona
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.password = hashedPassword;
        }

        // Verificar si el rol existe
        if (rol) {
            const existingRole = await Role.findOne({ rolName: rol });
            if (!existingRole) {
                logger.error('An error has occurred: The specified role does not exist')
                return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                    .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
            }
            updatedFields.rol = existingRole._id;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!updatedUser) {
            logger.error('An error has occurred: User not found')
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode).json(notFound({ message: 'User not found' })(req.path).body);
        }

        logger.info('User updated successfully')
        return res.status(ok(updatedUser).statusCode).json(ok(updatedUser));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            logger.error('An error has occurred: User not found')
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode).json(notFound({ message: 'User not found' })(req.path).body);
        }
        logger.info('User deleted successfully')
        return res.status(ok({ message: 'Successfully deleted user' }).statusCode).json(ok({ message: 'Successfully deleted user' }));
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`)
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};
