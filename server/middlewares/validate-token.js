import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

const validateToken = async (req, res, next) => {

    const authToken = req.headers.auth_token;

    if (authToken) {
        try {
            const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
            const userID = decodedToken.userID;
            const user = await User.findById(userID);
            if (user) {
                const isValidToken = user.valid_token.includes(authToken);

                if (isValidToken) {
                    req.profile_id = user.profile_id;
                    req.shop_id = user.shop_id;
                    req.decoded_token = decodedToken;
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

