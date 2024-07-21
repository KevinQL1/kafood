const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    idOrder: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    idCustomer: { type: Number, ref: 'Customer', required: true },
    idStore: { type: Number, ref: 'Store', required: true },
    state: {
        idState: { type: Number, ref: 'DeliveryStatus', required: true },
        stateName: { type: String, required: true }
    },
    products: [{ type: Number, ref: 'Product', required: true }],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
