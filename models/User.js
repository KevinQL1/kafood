import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true,  validate: {
    validator: function(v) {
      return /\S+@\S+\.\S+/.test(v);
    },
    message: props => `'${props.value}' not a valid email address`
  } },
  password: { type: String, required: true },
  rol: { type: Schema.Types.ObjectId, ref: 'Role' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
