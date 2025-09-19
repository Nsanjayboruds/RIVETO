import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'  // set a string as default, not boolean
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    date: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order; // ✅ This is the correct export
