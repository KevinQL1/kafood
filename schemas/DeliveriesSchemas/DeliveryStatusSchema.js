const mongoose = require('mongoose');

const deliveryStatusSchema = new mongoose.Schema({
    idState: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    stateName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryStatus', deliveryStatusSchema);
