const mongoose = require('mongoose');

const deliveryStatusSchema = new mongoose.Schema({
    idStatus: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    statusName: {
        type: String,
        required: true,
        unique: true,
        enum: [
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
            'Pedido en espera'   
        ]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryStatus', deliveryStatusSchema);