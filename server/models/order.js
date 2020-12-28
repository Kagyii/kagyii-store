import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
    items: { type: [Object], required: true },
    total_bill: { type: Number, required: true },
    accepted: { type: Boolean, default: false },
    customer_id: { type: Schema.Types.ObjectId, required: true },
    shop_id: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true });

const Order = mongoose.model('order', orderSchema);

export default Order;