import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: Schema.Types.ObjectId, ref: 'Role' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
