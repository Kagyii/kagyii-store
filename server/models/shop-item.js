import mongoose from 'mongoose';


const itemImageSchema = new mongoose.Schema({
    key: { type: String, required: true },
    location: { type: String, required: true }
});

const promoSchema = new mongoose.Schema({
    price: { type: Number },
    percentage: { type: Number },
    expiry: { type: Date }
});


const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: [{ type: itemImageSchema, required: true }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
    promo: { type: promoSchema },
    avaliable: { type: Boolean, default: true },
    pre_order: { type: String },
    category: [{ type: mongoose.Types.ObjectId, ref: 'shop_catalouge' }],
    shop_id: { type: mongoose.Types.ObjectId, required: true }
}, { timestamps: true });

const ShopItem = mongoose.model('shop_item', itemSchema);

export default ShopItem;

