import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String },
    password: { type: String },
    provider_user_id: { type: String },
    profile_setup: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    profile_id: { type: Schema.Types.ObjectId },
    shop_id: { type: Schema.Types.ObjectId },
    valid_token: [String]
});

const User = mongoose.model('User', userSchema);


export default User;