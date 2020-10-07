import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const itemImageSchema = new Schema({
    key: { type: String, required: true },
    location: { type: String, required: true }
});

const promoSchema = new Schema({
    price: { type: Number, required: true },
    percentage: { type: Number, required: true },
    expiry_date: { type: Date, required: true }
});


const itemSchema = new Schema({
    name: { type: String, required: true },
    images: { type: [itemImageSchema], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    promo: { type: promoSchema, default: {} },
    avaliable: { type: Boolean, default: true },
    pre_order: { type: String },
    category: { type: [Schema.Types.ObjectId] },
    shop_id: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true });

const ShopItem = mongoose.model('shop_item', itemSchema);

export default ShopItem;

