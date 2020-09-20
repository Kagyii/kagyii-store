import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    profile_setup: { type: Boolean, default: false },
    varified: { type: Boolean, default: false },
    profile_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    valid_token: [String]
});

const User = mongoose.model('User', userSchema);


export default User;