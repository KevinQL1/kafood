import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    rolName: {
        type: String,
        required: true,
        unique: true,
        enum: ['cliente', 'administrador', 'soporte', 'repartidor'] // Valores permitidos
    }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
