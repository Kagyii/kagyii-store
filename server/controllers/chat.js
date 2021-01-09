import { Chat, ChatSession } from '../models/chat.js';
import ShopProfile from '../models/shop-profile.js';
import { uploadImage } from '../aws/s3.js';

const chatBucket = "kagyii-store-chat";

export const createSession = async (req, res, next) => {
    const userId = req.body.user_id;
    const shopId = req.body.shop_id;

    try {
        const chatSession = new ChatSession({
            user_id: userId,
            shop_id: shopId
        });
        const chatSessionDoc = await chatSession.save();

        return res.json({
            status: 1,
            message: 'success',
            data: {
                session_id: chatSessionDoc._id
            }
        });

    } catch (err) {
        return next(new Error('db error'));
    }

};


export const deleteSession = async (req, res, next) => {

};

export const sendMessage = async () => {
    const sessionId = req.params.session_id;
    const from = req.body.from;
    const to = req.body.to;
    const userId = req.body.user_id;
    const shopId = req.body.shop_id;
    const text = req.body.text;
    const image = req.body.image;

    if (!text && ! !image) {
        return next(new Error('need message'));
    }

    try {
        const chatData = { session_id: sessionId, from: from, to: to };
        const message = { text: text };
        if (image) {
            const s3Image = await uploadImage(image, chatBucket, `${shopId}${userId}/`);
            message.img_key = s3Image.key;
            message.img_location = s3Image.location;
        }

        chatData.message = message;

        const chat = new Chat(chatData);
        const chatDoc = await chat.save();

        await ChatSession.updateOne({ _id: sessionId, user_id: userId, shop_id: shopId },
            { chat_id: chatDoc._id }).exec();

        return res.json({
            status: 1,
            message: 'success'
        });

    } catch (err) {
        return next(new Error('db error'));
    }

};