import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    provider_user_id: { type: String, unique: true, sparse: true },
    profile_setup: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    profile_id: { type: Schema.Types.ObjectId },
    shop_id: { type: Schema.Types.ObjectId },
    valid_token: [String]
}, { timestamps: true });

const User = mongoose.model('user', userSchema);


export default User;