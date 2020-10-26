import mongoose from 'mongoose';

const shopCatalougeSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamp: true });

const ShopCatalouge = mongoose.model('shop_catalouge', shopCatalougeSchema);

export default ShopCatalouge;