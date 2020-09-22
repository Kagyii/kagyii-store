import validator from 'express-validator';

import ShopProfile from '../models/shop-profile.js';
import { uploadImage } from '../aws/s3.js';
import User from '../models/user.js';

const shopProfileBucket = 'kagyii-store-shop-profile';

export const create = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const shopID = req.shop_id;

    if (shopID) {
        let error = new Error('shop already exist');
        error.status = 0;
        return next(error);
    }

    const userID = req.decoded_token.userID;
    const name = req.body.name;
    const preDefinedType = req.body.pre_defined_type;
    const userDefinedType = req.body.user_defined_type;
    const about = req.body.about;
    const phone = req.body.phone;
    const address = req.body.address;
    const profileImg = req.body.profile_image;
    const coverImg = req.body.cover_image;

    try {
        let coverImgPath;

        if (coverImg) {
            coverImgPath = await uploadImage(coverImg, shopProfileBucket, 'cover-images/');
        }
        const profileImgPath = await uploadImage(profileImg, shopProfileBucket, 'profile-images/')

        const shopProfile = new ShopProfile({
            name: name,
            pre_defined_type: preDefinedType,
            user_defined_type: userDefinedType,
            about: about,
            address: address,
            phone: phone,
            profile_img: profileImgPath,
            cover_img: coverImgPath
        });

        const shopProfileDetails = await shopProfile.save();
        await User.findByIdAndUpdate(userID, { shop_id: shopProfileDetails._id });

        return res.json({
            status: 1,
            message: 'success',
            data: shopProfileDetails
        })

    } catch (err) {
        console.log(err);
        let error = new Error('some error');
        error.status = 0;
        return next(error);
    }

}