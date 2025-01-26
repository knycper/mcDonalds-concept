import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    add: { type: Array, required: false },
    del: { type: Array, required: false },
    size: { type: String, required: false },
    imageUrl: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true }

});

const statusSchema = new mongoose.Schema({
    status: { type: String, required: false, default: "None" },
    orderTime: { type: String, required: false },
    estimatedTime: { type: String, required: false }
})

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adress: { type: String },
    phoneNumber: { type: String },
    history: { type: Array },
    order: { type: [orderSchema] },
    orderStatus: { type: statusSchema, default: () => ({ status: "None", orderTime: null, estimatedTime: null }) }
});

const User = mongoose.model('User', userSchema);

export default User;
