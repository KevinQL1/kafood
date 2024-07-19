import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  idClient: {
    type: Number,
    required: true,
    unique: true,
    min: 1000000, // Mínimo valor de 7 dígitos
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

// Método para comparar la contraseña
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Método para generar un token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, idClient: this.idClient, email: this.email, rol: this.rol }, process.env.JWT_SECRET, {
        expiresIn: '5m' // Expira en 5 min
    });
    return token;
};

const User = mongoose.model('User', userSchema);

export default User;
