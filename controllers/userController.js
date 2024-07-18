import User from '../models/User.js';
import { ok, badRequest, notFound, serverError, unauthorized } from '../utils/httpResponse.js';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(ok(users).statusCode).json(ok(users));
    } catch (error) {
        return res.status(serverError(req.path).statusCode).json(serverError(req.path));
    }
};

// Obtener un usuario por su ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(notFound({ message: 'Usuario no encontrado' })(req.path).statusCode).json(notFound({ message: 'Usuario no encontrado' })(req.path));
        }
        return res.status(ok(user).statusCode).json(ok(user));
    } catch (error) {
        return res.status(serverError(req.path).statusCode).json(serverError(req.path));
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        return res.status(ok(newUser).statusCode).json(ok(newUser));
    } catch (error) {
        if (error.code === 11000) {
            return res.status(badRequest({ message: 'Username or email already exists' })(req.path).statusCode).json(badRequest({ message: 'Username or email already exists' })(req.path));
        }
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path));
    }
};

// Actualizar un usuario por su ID
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, email, password }, { new: true });
        if (!updatedUser) {
            return res.status(notFound({ message: 'Usuario no encontrado' })(req.path).statusCode).json(notFound({ message: 'Usuario no encontrado' })(req.path));
        }
        return res.status(ok(updatedUser).statusCode).json(ok(updatedUser));
    } catch (error) {
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path));
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(notFound({ message: 'Usuario no encontrado' })(req.path).statusCode).json(notFound({ message: 'Usuario no encontrado' })(req.path));
        }
        return res.status(ok({ message: 'Usuario eliminado correctamente' }).statusCode).json(ok({ message: 'Usuario eliminado correctamente' }));
    } catch (error) {
        return res.status(badRequest(error)(req.path).statusCode).json(badRequest(error)(req.path));
    }
};
