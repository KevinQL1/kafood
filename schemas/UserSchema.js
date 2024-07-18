import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  idClient: {
    type: Number,
    required: true,
    unique: true,
    min: 1000000000, // Mínimo valor de 10 dígitos
    max: 9999999999, // Máximo valor de 10 dígitos
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: props => `'${props.value}' no es una dirección de correo electrónico válida`
    }
  },
  password: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date,
    required: true,
  },
  rol: {
    idRol: {
      type: Number,
      ref: 'Role',
      required: true
    },
    rolName: {
      type: String,
      ref: 'Role',
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
