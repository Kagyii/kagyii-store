import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    name: { type: String, required: true },
    address: { type: [String], required: true },
    phone: { type: [String], required: true }
});

const UserProfile = mongoose.model('User_Profile', userProfileSchema);

export default UserProfile;