import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'express-validator';
import dotenv from 'dotenv';

import Auth from '../models/auth.js';

dotenv.config();

export const signUpWithEmail = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err)
    }


    const email = req.body.email;
    const password = req.body.password;

    const salt = bcrypt.genSaltSync();
    const hashPassword = await bcrypt.hash(password, salt);

    const auth = new Auth({
        email: email,
        password: hashPassword
    })

    auth.save()
        .then(result => {
            return res.json({
                status: 1,
                message: 'success'
            });
        })
        .catch(err => {
            console.log(err);
        });

    // sign({ userId: userId, profileId: profileId }, process.env.ACCESS_TOKEN_SECRET);
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
        const user = await Auth.findOne({ email: email });
        let correctPwd = await bcrypt.compare(password, user.password)
        if (correctPwd) {
            const authToken = jwt.sign({ userID: user._id }, process.env.ACCESS_TOKEN_SECRET);
            return res.json({
                status: 1,
                message: 'success',
                data: {
                    auth_token: authToken
                }
            });
        } else {
            return res.json({
                status: 0,
                message: 'password not match'
            })
        }
    } catch (err) {
        console.log(err);
        return res.json({
            status: 0,
            message: 'some error'
        })
    }

}