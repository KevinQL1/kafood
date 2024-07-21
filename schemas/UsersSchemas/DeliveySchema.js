const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    idDelivery: {
        type: Number,
        required: true,
        unique: true,
        min: 1000000, // Mínimo valor de 7 dígitos
        max: 9999999999, // Máximo valor de 10 dígitos
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);
