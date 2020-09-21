import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, default: null },
    password: { type: String, default: null },
    provider_user_id: { type: String, default: null },
    profile_setup: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    profile_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    valid_token: [String]
});

const User = mongoose.model('User', userSchema);


export default User;