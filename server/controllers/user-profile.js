import UserProfile from '../models/user-profile.js';
import User from '../models/user.js';

export const create = async (req, res, next) => {

    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const userID = req.decoded_token.userID;

    const userProfile = new UserProfile({
        name: name,
        address: address,
        phone: phone
    });

    try {
        const user = await User.findById(userID);
        if (!user.profile_id) {
            const profile = await userProfile.save();
            await User.updateOne({ _id: userID }, { profile_setup: true, profile_id: profile._id }).exec();
            return res.json({
                status: 1,
                message: 'Success',
                data: {
                    profile: profile,
                    profile_setup: true
                }
            });
        } else {
            return next(new Error('already setup'));
        }

    } catch (err) {
        console.log(err);
        return next(new Error('database error'));
    }
};

export const get = async (req, res, next) => {

    const profileID = req.params.profile_id;

    try {
        const userProfile = await UserProfile.findById(profileID).exec();
        if (userProfile) {
            return res.json({
                status: 1,
                message: 'Success',
                data: userProfile
            });
        } else {
            return next(new Error('user profile not exist'));
        }

    } catch (err) {
        console.log(err);
        return next(new Error('database error'));
    }

};


export const edit = async (req, res, next) => {

    const profileID = req.params.profile_id;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const favShops = req.body.favourite_shops;
    const favTypes = req.body.favourite_types;
    const userProfileUpdate = {};

    if (req.params.profile_id != req.profile_id) {
        return next(new Error('permission error'));
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

    if (favShops) {
        userProfileUpdate.fav_shops = favShops;
    }

    if (favTypes) {
        userProfileUpdate.fav_types = favTypes;
    }


    try {

        if (Object.keys(userProfileUpdate).length != 0) {
            await UserProfile.updateOne({ _id: profileID }, userProfileUpdate).exec();
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
        return next(new Error('database error'));
    }

};