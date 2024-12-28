import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adress: {type: String},
    phoneNumber: {type: String},
    history: {type: Array}
});

const User = mongoose.model('User', userSchema);

export default User;
