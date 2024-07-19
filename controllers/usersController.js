import bcrypt from 'bcrypt';
import User from '../schemas/UserSchema.js';
import { ok, badRequest, notFound, serverError, unauthorized, forbidden } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';
import Role from '../schemas/RoleSchema.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

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
        if (req.user.rol.rolName === 'Cliente' || req.user.rol.rolName === 'Repartidor') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const user = await User.findOne({ idClient });
        if (!user) {
            logger.error('An error has occurred: User not found');
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode)
                .json(notFound({ message: 'User not found' })(req.path).body);
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
        if (req.user.rol.rolName !== 'Administrador') {
            if (req.user.idClient !== idClient) {
                return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                    .json(forbidden({ message: 'Access denied' })(req.path).body);
            }
        }

        const existingRole = await Role.findOne({ idRol });
        if (!existingRole) {
            logger.error('An error has occurred: The specified role does not exist');
            return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
            return res.status(badRequest({ message: 'User or email already exists' })(req.path).statusCode)
                .json(badRequest({ message: 'User or email already exists' })(req.path).body);
        }
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode)
            .json(badRequest(error)(req.path).body);
    }
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

        // Validación basada en el rol del usuario
        if (req.user.rol.rolName === 'Cliente' || req.user.rol.rolName === 'Repartidor') {
            if (req.user.idClient !== idClient) {
                return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                    .json(forbidden({ message: 'Access denied' })(req.path).body);
            }
            // Solo se puede actualizar el nombre y la contraseña
            if (email || birthdate || idRol) {
                return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                    .json(forbidden({ message: 'Access denied' })(req.path).body);
            }
        } else if (req.user.rol.rolName === 'Soporte') {
            // Soporte puede actualizar cualquier campo excepto idClient y email
            if (idRol || email) {
                return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                    .json(forbidden({ message: 'Access denied' })(req.path).body);
            }
        } else if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
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

        if (idRol) {
            const existingRole = await Role.findOne({ idRol });
            if (!existingRole) {
                return res.status(notFound({ message: 'The specified role does not exist' })(req.path).statusCode)
                    .json(notFound({ message: 'The specified role does not exist' })(req.path).body);
            }
            updatedFields.rol = {
                idRol: existingRole.idRol,
                rolName: existingRole.rolName
            };
        }

        if (name && name !== findUser.name) updatedFields.name = name;
        if (email && email !== findUser.email && req.user.rol.rolName !== 'Soporte') updatedFields.email = email;
        if (birthdate && new Date(birthdate).toISOString().split('T')[0] !== findUser.birthdate.toISOString().split('T')[0]) {
            updatedFields.birthdate = birthdate;
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
        return res.status(badRequest(error)(req.path).statusCode)
            .json(badRequest(error)(req.path).body);
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const idClient = parseInt(id);

    try {
        if (req.user.rol.rolName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const deletedUser = await User.findOneAndDelete({ idClient });
        if (!deletedUser) {
            logger.error('An error has occurred: User not found');
            return res.status(notFound({ message: 'User not found' })(req.path).statusCode)
                .json(notFound({ message: 'User not found' })(req.path).body);
        }

        logger.info('User deleted successfully');
        return res.status(ok({ message: 'Successfully deleted user' }).statusCode)
            .json(ok({ message: 'Successfully deleted user' }).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode)
            .json(badRequest(error)(req.path).body);
    }
};

// Nueva función de login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.error('Invalid email');
            return res.status(unauthorized({ message: 'Invalid email' })(req.path).statusCode)
                .json(unauthorized({ message: 'Invalid email' })(req.path).body);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.error('Invalid password');
            return res.status(unauthorized({ message: 'Invalid password' })(req.path).statusCode)
                .json(unauthorized({ message: 'Invalid password' })(req.path).body);
        }

        const token = user.generateAuthToken();
        logger.info('User logged in successfully');
        return res.status(ok({ token }).statusCode).json(ok({ token, expiresIn: '5m' }).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};
