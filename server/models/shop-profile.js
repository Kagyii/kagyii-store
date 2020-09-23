import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const catalougeSchema = new Schema({
    name: { type: String, required: true }
})

const shopSchema = new Schema({
    name: { type: String, required: true },
    pre_defined_type: { type: mongoose.Schema.Types.ObjectId, required: true },
    user_defined_type: { type: String },
    about: { type: String },
    address: { type: String, required: true },
    phone: { type: [String], required: true },
    profile_img_location: { type: String, required: true },
    profile_img_key: { type: String, required: true },
    cover_img_location: { type: String },
    cover_img_key: { type: String },
    catalouge: [catalougeSchema]
});

const ShopProfile = mongoose.model('shop', shopSchema);

export default ShopProfile;