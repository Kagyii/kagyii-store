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
    profile_img: { type: String, required: true },
    cover_img: { type: String },
    catalouge: [catalougeSchema]
});

const ShopProfile = mongoose.model('shop', shopSchema);

export default ShopProfile;