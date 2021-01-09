import mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const { Types: { Long } } = mongoose;


const shopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pre_defined_type: { type: mongoose.Types.ObjectId, ref: 'suggestion', required: true },
    user_defined_type: { type: String },
    about: { type: String },
    address: { type: String, required: true },
    phone: { type: [String], required: true },
    city: { type: mongoose.Types.ObjectId, ref: 'suggestion', required: true },
    profile_img_location: { type: String, required: true },
    profile_img_key: { type: String, required: true },
    cover_img_location: { type: String },
    cover_img_key: { type: String },
    promo_expiry: { type: Date },
    promo_percentage: { type: Number, default: 0 },
    popularity: { type: Long, default: 0 },
    cush_on_delivery: { type: Boolean, default: false },
    payment: { type: [Object] }
}, { timestamps: true });

const ShopProfile = mongoose.model('shop', shopSchema);

export default ShopProfile;