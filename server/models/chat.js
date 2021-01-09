import mongoose from 'mongoose';

// const metaScheam = new mongoose.Schema({
//     chat_id: { type: mongoose.Types.ObjectId, required: true }
// });

const chatSessionSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Types.ObjectId, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    chat_id: { type: mongoose.Types.ObjectId }
}, { timestamps: true });

export const ChatSession = mongoose.model('chat_session', chatSessionSchema);


const chatSchema = new mongoose.Schema({
    session_id: { type: mongoose.Types.ObjectId, required: true },
    message: { type: Object, required: true },
    from: { type: mongoose.Types.ObjectId, required: true },
    to: { type: mongoose.Types.ObjectId, required: true }
}, { timestamps: true });

export const Chat = mongoose.model('chat', chatSchema);

