import jwt from 'jsonwebtoken';
import { JWT, JWKS, errors } from 'jose';
import bcrypt from 'bcryptjs';
import validator from 'express-validator';
import axios from 'axios';
import dotenv from 'dotenv';

import User from '../models/user.js';
import UserProfile from '../models/user-profile.js';

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
            await User.updateOne({ _id: newUser._id }, { "$push": { valid_token: authToken } });
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


export const signInOrLoginWithProviders = async (req, res, next) => {

    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err)
    }

    const accessToken = req.body.access_token;
    const providerName = req.body.provider_name;

    try {

        let providerUserID;

        if (providerName == 'apple') {
            const response = await axios({
                method: 'get',
                url: 'https://appleid.apple.com/auth/keys',
                timeout: 5000
            });

            const key = JWKS.asKeyStore(response.data);
            const verifiedData = JWT.verify(accessToken, key);

            providerUserID = verifiedData.sub;

        } else if (providerName == 'facebook') {

            const response = await axios({
                method: 'get',
                url: 'https://graph.facebook.com/debug_token',
                timeout: 5000,
                params: { input_token: accessToken, access_token: '323263692096120|HYh9St86gbznHMeCGXh-WCG4VEc' }
            })
            providerUserID = response.data.data.user_id;

            if (providerUserID) {
                let error = new Error('not a facebook user');
                error.status = 0;
                return next(error);
            }

        }


        const user = await User.findOne({ provider_user_id: providerUserID });

        if (user) {

            const authToken = jwt.sign({ userID: user._id }, process.env.ACCESS_TOKEN_SECRET);
            await User.updateOne({ _id: user._id }, { "$push": { valid_token: authToken } });

            return res.json({
                status: 1,
                message: 'success',
                data: {
                    auth_token: authToken,
                    profile_setup: user.profile_setup,
                    profile_id: user.profile_id
                }
            });

        } else {
            const auth = new User({
                provider_user_id: providerUserID,
                verified: true
            });

            const newUser = await auth.save();
            const authToken = jwt.sign({ userID: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
            await User.updateOne({ _id: newUser._id }, { "$push": { valid_token: authToken } });

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
        if (err instanceof errors.JOSEError && err.code === 'ERR_JWS_VERIFICATION_FAILED') {
            let error = new Error('not a apple user');
            error.status = 0;
            return next(error);
        } else {
            let error = new Error('some error');
            error.status = 0;
            return next(error);
        }

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
                await User.updateOne({ _id: user._id }, { "$push": { valid_token: authToken } });

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
        let error = new Error('some errors')
        error.status = 0;
        return next(error);
    }

}