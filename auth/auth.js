import jwt from 'jsonwebtoken';
import { unauthorized } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';
import Administrator from '../schemas/UsersSchemas/AdministratorSchema';
import Support from '../schemas/UsersSchemas/SupportSchema';
import Customer from '../schemas/UsersSchemas/CustomerSchema';
import Dealer from '../schemas/UsersSchemas/DealerSchema';

// Middleware de Autenticación
export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header

    if (!token) {
        logger.error('An error has occurred: No token provided');
        return res.status(unauthorized({ message: 'No token provided' })(req.path).statusCode)
            .json(unauthorized({ message: 'No token provided' })(req.path).body);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar en cada tabla de usuarios
        let user = await Administrator.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            user = await Support.findOne({ _id: decoded._id, 'tokens.token': token });
            if (!user) {
                user = await Customer.findOne({ _id: decoded._id, 'tokens.token': token });
                if (!user) {
                    user = await Dealer.findOne({ _id: decoded._id, 'tokens.token': token });
                }
            }
        }

        if (!user) {
            throw new Error('Not authenticated');
        }

        req.user = user; // Guardar la información del usuario en req.user
        req.token = token; // Guardar el token en req.token
        next();
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(unauthorized({ message: 'Invalid token' })(req.path).statusCode)
            .json(unauthorized({ message: 'Invalid token' })(req.path).body);
    }
};
