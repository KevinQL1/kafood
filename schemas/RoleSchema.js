import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    idRol: {
        type: Number,
        required: true,
        unique: true,
        default: 1 // Puedes establecer un valor por defecto o inicial
    },
    rolName: {
        type: String,
        required: true,
        unique: true,
        enum: ['Cliente', 'Administrador', 'Soporte', 'Repartidor']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
