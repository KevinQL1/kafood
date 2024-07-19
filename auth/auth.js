import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';

// Middleware de Autenticación
export const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header

    if (!token) {
        logger.error('An error has occurred: No token provided');
        return res.status(unauthorized({ message: 'No token provided' })(req.path).statusCode)
            .json(unauthorized({ message: 'No token provided' })(req.path).body);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardar la información del usuario en req.user
        next();
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(unauthorized({ message: 'Invalid token' })(req.path).statusCode)
            .json(unauthorized({ message: 'Invalid token' })(req.path).body);
    }
};

// Middleware de Autorización
export const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.rol.rolName)) {
        logger.error('An error has occurred: Access denied');
        return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
            .json(forbidden({ message: 'Access denied' })(req.path).body);
    }
    next();
};

