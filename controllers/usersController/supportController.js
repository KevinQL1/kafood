import bcrypt from 'bcrypt';
import Support from '../../schemas/UsersSchemas/SupportSchema.js';
import { ok, badRequest, notFound, serverError, unauthorized, forbidden } from '../../utils/httpResponse.js';
import logger from '../../utils/logger.js';

// Obtener todos los usuarios
export const getSupports = async (req, res) => {
    try {
        const users = await Support.find();
        logger.info('Users retrieved successfully');
        return res.status(ok(users).statusCode).json(ok(users).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un usuario por su ID
export const getSupportById = async (req, res) => {
    const { id } = req.params;
    const idSupport = parseInt(id);

    try {
        const user = await Support.findOne({ idSupport });
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
export const createSupport = async (req, res) => {
    const { idSupport, name, email, password } = req.body;

    try {
        if (req.user.idSupport !== idSupport) {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            idSupport,
            name,
            email,
            password: hashedPassword
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
export const updateSupport = async (req, res) => {
    const { id } = req.params;
    const idSupportstrator = parseInt(id);
    const { idSupport, name, email, password, } = req.body;

    try {
        const findUser = await User.findOne({ idSupport: idSupportstrator });

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

        if (name && name !== findUser.name) updatedFields.name = name;
        if (email && email !== findUser.email) updatedFields.email = email;

        const oldUser = {
            idSupport: findUser.idSupport,
            name: findUser.name,
            email: findUser.email,
            password: findUser.password
        };

        if (compareObjects(oldUser, updatedFields)) {
            logger.error('An error has occurred: No fields to update');
            return res.status(badRequest({ message: 'No fields to update' })(req.path).statusCode)
                .json(badRequest({ message: 'No fields to update' })(req.path).body);
        }

        const updatedUser = await User.findOneAndUpdate({ idSupport }, updatedFields, { new: true });

        logger.info('User updated successfully');
        return res.status(ok(updatedUser).statusCode).json(ok(updatedUser).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(badRequest(error)(req.path).statusCode)
            .json(badRequest(error)(req.path).body);
    }
};

// Eliminar un usuario por su ID
export const deleteSupport = async (req, res) => {
    const { id } = req.params;
    const idSupport = parseInt(id);

    try {
        const deletedUser = await User.findOneAndDelete({ idSupport });
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

// login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Support.findOne({ email });
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
