import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

const validateToken = async (req, res, next) => {

    const authToken = req.headers.auth_token;

    if (authToken) {
        try {
            const userInfo = {};
            const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
            userInfo.user_id = decodedToken.userID;
            const user = await User.findById(userInfo.user_id);

            if (user) {
                const isValidToken = user.valid_token.includes(authToken);

                if (isValidToken) {
                    userInfo.profile_id = user.profile_id;
                    userInfo.shop_id = user.shop_id;
                    req.user_info = userInfo;
                    return next();
                } else {
                    return next(new Error('Token was no longer valid'));
                }
            } else {
                return next(new Error('User was no longer exist'));
            }

        } catch (err) {
            return next(err);
        }
    } else {
        return next(new Error('Require auth token'));
    }
};

export default validateToken;

