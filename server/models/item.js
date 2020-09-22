import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    original_price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    promo_price: { type: Number },
    category: { type: Schema.Types.ObjectId, required: true },
    owner: { type: Schema.Types.ObjectId, required: true }
})