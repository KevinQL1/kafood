const mongoose = require('mongoose');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const deliverySchema = new mongoose.Schema({
    idDelivery: {
        type: Number,
        required: true,
        unique: true,
        min: 1000000, // Mínimo valor de 7 dígitos
        max: 9999999999, // Máximo valor de 10 dígitos
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `'${props.value}' not a valid email address`
        }
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    birthdate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Método para comparar la contraseña
deliverySchema.methods.comparePassword = (candidatePassword) => {
    return bcrypt.compare(candidatePassword, this.password);
};

// Método para generar un token
deliverySchema.methods.generateAuthToken = () => {
    const token = jwt.sign({ _id: this._id, idDelivery: this.idDelivery, email: this.email }, process.env.JWT_SECRET, {
        expiresIn: '5m' // Expira en 5 min
    });
    return token;
};

module.exports = mongoose.model('Delivery', deliverySchema);
