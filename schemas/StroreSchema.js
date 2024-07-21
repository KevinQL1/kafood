const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    idStore: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    schedule: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', storeSchema);