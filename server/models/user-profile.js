import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    name: { type: String, required: true },
    address: { type: [String], required: true },
    phone: { type: [String], required: true },
    fav_shops: [{ type: Schema.Types.ObjectId, ref: 'shop' }]
}, { timestamps: true });

const UserProfile = mongoose.model('user_profile', userProfileSchema);

export default UserProfile;