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
            await User.findByIdAndUpdate(userID, { profile_setup: true, profile_id: profile._id });
            return res.json({
                status: 1,
                message: 'Success',
                data: {
                    profile: {
                        name: profile.name,
                        address: profile.address,
                        phone: profile.phone
                    },
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

    const profileID = req.profile_id;

    try {
        const userProfile = await UserProfile.findById(profileID);
        return res.json({
            status: 1,
            message: 'Success',
            data: userProfile
        });
    } catch (err) {
        console.log(err);
        let error = new Error('some error');
        error.status = 0;
        return next(error);
    }

}