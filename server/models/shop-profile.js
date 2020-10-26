import mongoose from 'mongoose';
import mongooseLong from 'mongoose-long';

mongooseLong(mongoose);
const { Types: { Long } } = mongoose;

const Schema = mongoose.Schema;

const shopSchema = new Schema({
    name: { type: String, required: true },
    pre_defined_type: { type: Schema.Types.ObjectId, ref: 'suggestion', required: true },
    user_defined_type: { type: String },
    about: { type: String },
    address: { type: String, required: true },
    phone: { type: [String], required: true },
    city: { type: Schema.Types.ObjectId, ref: 'suggestion', required: true },
    profile_img_location: { type: String, required: true },
    profile_img_key: { type: String, required: true },
    cover_img_location: { type: String },
    cover_img_key: { type: String },
    promo_expiry: { type: Date },
    promo_percentage: { type: Number, default: 0 },
    popularity: { type: Long, default: 0 },
    catalouge: [{ type: Schema.Types.ObjectId, ref: 'shop_catalouge' }]
}, { timestamps: true });

const ShopProfile = mongoose.model('shop', shopSchema);

export default ShopProfile;