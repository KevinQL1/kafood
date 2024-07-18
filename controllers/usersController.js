import bcrypt from 'bcrypt';
import User from '../schemas/UserSchema.js';
import { ok, badRequest, notFound, serverError, unauthorized } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';
import Role from '../schemas/RoleSchema.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        logger.info('Users retrieved successfully');
        return res.status(ok(users).statusCode).json(ok(users).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const idClient = parseInt(id);
    try {
        const user = await User.findOne({ idClient });
        if (!user) {
            logger.error('An error has occurred: User not found');
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode).json(notFound({ message: 'User not found' })(req.path).body);
        }
        logger.info('User retrieved successfully');
        return res.status(ok(user).statusCode).json(ok(user).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { idClient, name, email, password, idRol, birthdate } = req.body;

    try {
        // Verificar si el rol existe
        const existingRole = await Role.findOne({ idRol });
        if (!existingRole) {
            logger.error('An error has occurred: The specified role does not exist');
            return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
        }

        //Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario con los datos completos del rol
        const newUser = new User({
            idClient,
            name,
            email,
            password: hashedPassword,
            birthdate,
            rol: {
                idRol: existingRole.idRol,
                rolName: existingRole.rolName
            }
        });

        await newUser.save();

        logger.info('User created successfully');
        return res.status(ok(newUser).statusCode).json(ok(newUser).body);
    } catch (error) {
        if (error.code === 11000) {
            logger.error(`An error has occurred: ${error.message}`);
            return res.status(badRequest({ message: 'User or email already exists' })(req.path).statusCode).json(badRequest({ message: 'User or email already exists' })(req.path).body);
        }
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};

const compareObjects = (oldObj, newObj) => {
    for (const key in oldObj) {
        if (newObj.hasOwnProperty(key)) {
            if (key === 'birthdate') {
                const oldDate = new Date(oldObj[key]).toISOString().split('T')[0];
                const newDate = new Date(newObj[key]).toISOString().split('T')[0];
                if (oldDate !== newDate) return false;
            } else if (typeof oldObj[key] === 'object' && oldObj[key] !== null) {
                if (!compareObjects(oldObj[key], newObj[key])) return false;
            } else if (oldObj[key] !== newObj[key]) return false;
        }
    }
    return true;
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const idClient = parseInt(id);
    const { name, email, password, birthdate, idRol } = req.body;

    try {
        const findUser = await User.findOne({ idClient });

        if (!findUser) {
            logger.error('An error has occurred: User not found');
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode)
                .json(notFound({ message: 'User not found' })(req.path).body);
        }

        let updatedFields = {};

        if (password) {
            const passwordMatch = await bcrypt.compare(password, findUser.password);
            if (passwordMatch) {
                logger.error('Password remains the same');
                return res.status(badRequest({ message: 'Password remains the same' })(req.path).statusCode)
                    .json(badRequest({ message: 'Password remains the same' })(req.path).body);
            }
            updatedFields.password = await bcrypt.hash(password, 10);
        }

        const existingRole = await Role.findOne({ idRol });
        if (!existingRole) {
            logger.error('An error has occurred: The specified role does not exist');
            return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
        }

        if (name && name !== findUser.name) updatedFields.name = name;
        if (email && email !== findUser.email) updatedFields.email = email;
        if (birthdate && new Date(birthdate).toISOString().split('T')[0] !== findUser.birthdate.toISOString().split('T')[0]) {
            updatedFields.birthdate = birthdate;
        }
        if (idRol && idRol !== findUser.rol.idRol) {
            updatedFields.rol = {
                idRol: existingRole.idRol,
                rolName: existingRole.rolName
            };
        }

        const oldUser = { name: findUser.name, email: findUser.email, password: findUser.password, birthdate: findUser.birthdate, rol: findUser.rol };
        if (compareObjects(oldUser, updatedFields)) {
            logger.error('An error has occurred: No fields to update');
            return res.status(badRequest({ message: 'No fields to update' })(req.path).statusCode)
                .json(badRequest({ message: 'No fields to update' })(req.path).body);
        }

        const updatedUser = await User.findOneAndUpdate({ idClient }, updatedFields, { new: true });

        logger.info('User updated successfully');
        return res.status(ok(updatedUser).statusCode).json(ok(updatedUser).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const idClient = parseInt(id);

    try {
        const deletedUser = await User.findOneAndDelete({ idClient });
        if (!deletedUser) {
            logger.error('An error has occurred: User not found');
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode).json(notFound({ message: 'User not found' })(req.path).body);
        }
        logger.info('User deleted successfully');
        return res.status(ok({ message: 'Successfully deleted user' }).statusCode).json(ok({ message: 'Successfully deleted user' }).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path).body);
    }
};
