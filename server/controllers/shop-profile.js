import validator from 'express-validator';

import ShopProfile from '../models/shop-profile.js';

export const create = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const name = req.body.name;
    const preDefinedType = req.body.pre_defined_type;
    const userDefinedType = req.body.user_defined_type;
    const about = req.body.about;
    const phone = req.body.phone;
    const address = req.body.address;
    const profileImg = req.body.profile_image;
    const coverImg = req.body.cover_image;


    const shopProfile = new ShopProfile({
        name: name,
        pre_defined_type: preDefinedType,
        user_defined_type: userDefinedType,
        about: about,
        address: address,
        phone: phone,
        profile_img: profileImg,
        cover_img: coverImg
    });

    try {
        await shopProfile.save();
    } catch (err) {
        console.log(err);
    }

}