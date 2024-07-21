const mongoose = require('mongoose');

const OrderDeliverySchema = new mongoose.Schema({
    idClient: { type: Number, ref: 'User', required: true },
    idDelivery: { type: Number, ref: 'User', required: true },
    idStore: { type: Number, ref: 'Store', required: true },
    state: {
        idState: { type: Number, ref: 'DeliveryStatus', required: true },
        stateName: { type: String, required: true }
    },
    deliveryAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    deliverDate: { type: Date },
    products: [{ type: Number, ref: 'Product', required: true }],
});

module.exports = mongoose.model('OrderDelivery', OrderDeliverySchema);