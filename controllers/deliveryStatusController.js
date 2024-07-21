import DeliveryStatus from '../schemas/DeliveryStatusSchema.js';
import { ok, badRequest, serverError, notFound, forbidden } from '../utils/httpResponse.js';
import logger from '../utils/logger.js';

const deliveryStatusPermit = [
    'Pago Realizado',
    'Pago Rechazado',
    'Pedido Creado',
    'Pedido aceptado por el restaurante',
    'En preparación',
    'Repartidor recolectando',
    'En camino a tu dirección',
    'En 3 minutos llega tu repartidor',
    'Entregado',
    'Cancelado',
    'Pedido Rechazado',
    'Pago en espera',
    'Pedido en espera'];

// Obtener el último ID de estados
const getLastDeliveryStatusId = async () => {
    const lastDeliveryStatus = await DeliveryStatus.findOne({}, {}, { sort: { 'idStatus': -1 } });
    return lastDeliveryStatus ? lastDeliveryStatus.idStatus : 0;
};

// Obtener todos los estados de entrega
export const getDeliveryStatuses = async (req, res) => {
    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.statusName !== 'Administrador' || req.user.rol.statusName !== 'Soporte') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const deliveryStatus = await DeliveryStatusSchema.find();
        logger.info('Delivery statuses retrieved successfully');
        return res.status(ok(deliveryStatus).statusCode).json(ok(deliveryStatus).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Obtener un estado de entrega por su ID
export const getDeliveryStatusById = async (req, res) => {
    const { id } = req.params;
    const idStatus = parseInt(id);

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.statusName !== 'Administrador' || req.user.rol.statusName !== 'Soporte') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const deliveryStatus = await DeliveryStatus.findOne({ idStatus });

        if (!DeliveryStatus) {
            logger.error('An error has occurred: Delivery status not found');
            return res.status(notFound({ message: 'Delivery status not found' })(req.path).statusCode)
                .json(notFound({ message: 'Delivery status not found' })(req.path).body);
        }

        logger.info('Delivery status retrieved successfully');
        return res.status(ok(deliveryStatus).statusCode).json(ok(deliveryStatus).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Crear un nuevo estado de entrega
export const createDeliveryStatus = async (req, res) => {
    const { statusName } = req.body;

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.statusName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        // Verificar si el estado de entrega (statusName) está permitido
        if (!deliveryStatusPermit.includes(statusName)) {
            logger.error('An error has occurred: Delivery status not allowed');
            return res.status(badRequest({ message: 'Delivery status not allowed' })(req.path).statusCode)
                .json(badRequest({ message: 'Delivery status not allowed' })(req.path).body);
        }

        // Verificar si el estado de entrega (statusName) ya existe en la base de datos
        const existingDeliveryStatus = await DeliveryStatus.findOne({ statusName });
        if (existingDeliveryStatus) {
            logger.error(`An error has occurred: Delivery status '${statusName}' already exists`);
            return res.status(badRequest({ message: `Delivery status '${statusName}' already exists` })(req.path).statusCode)
                .json(badRequest({ message: `Delivery status '${statusName}' already exists` })(req.path).body);
        }

        // Obtener el último ID de estados
        const lastDeliveryStatusId = await getLastDeliveryStatusId();

        // Crear el nuevo estado de entrega con el ID autoincrementado
        const newDeliveryStatus = new DeliveryStatusSchema({ idStatus: lastDeliveryStatusId + 1, statusName });
        await newDeliveryStatus.save();

        logger.info('Delivery status created successfully');
        return res.status(ok(newDeliveryStatus).statusCode).json(ok(newDeliveryStatus).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Actualizar un rol por su ID
export const updateDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    const idStatus = parseInt(id);
    const { statusName } = req.body;

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.statusName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        // Verificar si el statusName está permitido
        if (!deliveryStatusPermit.includes(statusName)) {
            logger.error('An error has occurred: Delivery status not allowed');
            return res.status(badRequest({ message: 'Delivery status not allowed' })(req.path).statusCode)
                .json(badRequest({ message: 'Delivery status not allowed' })(req.path).body);
        }

        const updatedDeliveryStatus = await DeliveryStatus.findOneAndUpdate({ idStatus }, { statusName }, { new: true });

        if (!updatedDeliveryStatus) {
            logger.error('An error has occurred: Delivery status not found');
            return res.status(notFound({ message: 'Delivery status not found' })(req.path).statusCode)
                .json(notFound({ message: 'Delivery status not found' })(req.path).body);
        }

        logger.info('Delivery status updated successfully');
        return res.status(ok(updatedDeliveryStatus).statusCode).json(ok(updatedDeliveryStatus).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};

// Eliminar un rol por su ID
export const deleteDeliveryStatus = async (req, res) => {
    const { id } = req.params;
    const idStatus = parseInt(id);

    try {
        // Verificar el rol del usuario que hace la solicitud
        if (req.user.rol.statusName !== 'Administrador') {
            return res.status(forbidden({ message: 'Access denied' })(req.path).statusCode)
                .json(forbidden({ message: 'Access denied' })(req.path).body);
        }

        const deletedDeliveryStatus = await DeliveryStatus.findOneAndDelete({ idStatus });

        if (!deletedDeliveryStatus) {
            logger.error('An error has occurred: Delivery status not found');
            return res.status(notFound({ message: 'Delivery status not found' })(req.path).statusCode)
                .json(notFound({ message: 'Delivery status not found' })(req.path).body);
        }

        logger.info('Delivery status deleted successfully');
        return res.status(ok({ message: 'Successfully deleted delivery status' }).statusCode)
            .json(ok({ message: 'Successfully deleted delivery status' }).body);
    } catch (error) {
        logger.error(`An error has occurred: ${error.message}`);
        return res.status(serverError(req.path).statusCode).json(serverError(req.path).body);
    }
};
