import mongoose from 'mongoose';


const userProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: [String], required: true },
    phone: { type: [String], required: true },
    fav_shops: [{ type: mongoose.Types.ObjectId, ref: 'shop' }],
    fav_types: [{ type: mongoose.Types.ObjectId, ref: 'suggestion' }]
}, { timestamps: true });

const UserProfile = mongoose.model('user_profile', userProfileSchema);

export default UserProfile;