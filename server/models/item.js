import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    image_key: { type: String, required: true },
    image_location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    promo_price: { type: Number },
    category: [Schema.Types.ObjectId],
    shop_id: { type: Schema.Types.ObjectId, required: true }
});

const Item = mongoose.model('shop_item', itemSchema);

export default Item;

