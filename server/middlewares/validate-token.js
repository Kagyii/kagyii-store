import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

const validateToken = async (req, res, next) => {

    const authToken = req.headers.auth_token;

    try {
        const decodedToken = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
        const userID = decodedToken.userID;
        const user = await User.findById(userID);
        if (user) {
            const isValidToken = user.valid_token.includes(authToken);
            if (isValidToken) {
                req.decodedToken = decodedToken;
                return next();
            } else {
                let error = new Error('Token was no longer valid');
                error.status = 0;
                return next(error);
            }
        } else {
            let error = new Error('User was no longer exist');
            error.status = 0;
            return next(error);
        }

    } catch (err) {
        console.log(err);
        err.status = 0;
        return next(err);
    }
}

export default validateToken;

