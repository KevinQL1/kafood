const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    idCustomer: { type: Number, ref: 'Customer', required: true },
    idDelivery: { type: Number, ref: 'Delivery', required: true },
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

module.exports = mongoose.model('Deliverie', deliverySchema);
