import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adress: {type: String},
    phoneNr: {type: String}
});

const User = mongoose.model('User', userSchema);

export default User;
