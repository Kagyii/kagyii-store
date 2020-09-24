import validator from 'express-validator';

import UserProfile from '../models/user-profile.js'
import User from '../models/user.js'

export const create = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const userID = req.decoded_token.userID;

    const userProfile = new UserProfile({
        name: name,
        address: address,
        phone: phone
    })

    try {
        const user = await User.findById(userID);
        if (!user.profile_id) {
            const profile = await userProfile.save();
            await User.updateOne({ _id: userID }, { profile_setup: true, profile_id: profile._id });
            return res.json({
                status: 1,
                message: 'Success',
                data: {
                    profile: profile,
                    profile_setup: true
                }
            })
        } else {
            let error = new Error('already setup');
            error.status = 0;
            return next(error);
        }

    } catch (err) {
        console.log(err);
        let error = new Error('some error');
        error.status = 0;
        return next(error);
    }
}

export const get = async (req, res, next) => {

    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const profileID = req.params.profile_id;

    try {
        const userProfile = await UserProfile.findById(profileID);
        if (userProfile) {
            return res.json({
                status: 1,
                message: 'Success',
                data: userProfile
            });
        } else {
            let error = new Error('user profile not exist');
            error.status = 0;
            return next(error);
        }

    } catch (err) {
        console.log(err);
        let error = new Error('some error');
        error.status = 0;
        return next(error);
    }

}


export const edit = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const profileID = req.params.profile_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const userProfileUpdate = {};

    if (req.params.profile_id != req.profile_id) {
        let error = new Error('permission error');
        error.status = 0;
        return next(error);
    }

    if (name) {
        userProfileUpdate.name = name;
    }

    if (address) {
        userProfileUpdate.address = address;
    }

    if (phone) {
        userProfileUpdate.phone = phone;
    }

    try {

        if (Object.keys(userProfileUpdate).length != 0) {
            const userProfile = await UserProfile.findByIdAndUpdate(profileID, userProfileUpdate);
            return res.json({
                status: 1,
                message: 'success'
            });
        } else {
            let error = new Error('no update data');
            error.status = 0;
            return next(error);
        }

    } catch (err) {
        console.log(err);
        let error = new Error('some error');
        error.status = 0;
        return next(error);
    }

}