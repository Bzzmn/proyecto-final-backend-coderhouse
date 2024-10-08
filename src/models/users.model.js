import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    password: { type: String, required: false }, 
    githubId: { type: String, required: false }, 
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type: String, default: 'user' }
});

const userModel = mongoose.model('users', userSchema);

export default userModel;

