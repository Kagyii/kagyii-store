import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'express-validator';
import dotenv from 'dotenv';

import User from '../models/user.js';

dotenv.config();

export const signUpWithEmail = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }


    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            let error = new Error('email already exist');
            error.status = 0;
            return next(error);
        } else {
            const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync());
            const auth = new User({
                email: email,
                password: hashPassword
            });
            const newUser = await auth.save();
            const authToken = jwt.sign({ userID: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
            await User.updateOne({ _id: newUser._id }, { "$push": { valid_token: authToken } })
            return res.json({
                status: 1,
                message: 'success',
                data: {
                    auth_token: authToken,
                    profile_setup: newUser.profile_setup
                }
            });
        }

    } catch (err) {
        console.log(err);
        err.status = 0;
        return next(err);
    }
}

export const loginWithEmail = async (req, res, next) => {

    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err)
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            let correctPwd = await bcrypt.compare(password, user.password);
            if (correctPwd) {
                const authToken = jwt.sign({ userID: user._id }, process.env.ACCESS_TOKEN_SECRET);
                return res.json({
                    status: 1,
                    message: 'success',
                    data: {
                        auth_token: authToken,
                        profile_setup: user.profile_setup
                    }
                });
            } else {
                let error = new Error('password not match');
                error.status = 0;
                return next(error);
            }
        } else {
            let error = new Error('user not exist');
            error.status = 0;
            return next(error);
        }

    } catch (err) {
        console.log(err);
        err.status = 0;
        return next(err);
    }

}