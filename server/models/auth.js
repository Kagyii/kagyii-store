import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authSchema = new Schema({
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    profile_setup: { type: Boolean, default: false },
    varified: { type: Boolean, default: false },
    jwt: [String]
});

const Auth = mongoose.model('Auth', authSchema);

export default Auth;