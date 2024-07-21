const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    idProduct: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    idStore: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    imageURL: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);