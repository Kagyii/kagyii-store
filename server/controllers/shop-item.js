import validator from 'express-validator';

import ShopItem from '../models/item.js';
import ShopProfile from '../models/shop-profile.js';
import { uploadImage } from '../aws/s3.js'

const shopItemBucket = 'kagyii-store-shop-item';

export const add = async (req, res, next) => {
    const validationErr = validator.validationResult(req);

    if (!validationErr.isEmpty()) {
        let err = new Error(validationErr.errors[0].msg);
        err.status = 0;
        return next(err);
    }

    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const category = req.body.category;
    const shopID = req.params.shop_id;
    const promoPrice = req.body.promo_price;

    if (shopID != req.shop_id) {
        let error = new Error('permission error');
        error.status = 0;
        return next(error);
    }


    try {

        if (category) {
            const shopProfile = await ShopProfile.findOne({ 'catalouge._id': category }).exec();
            if (!shopProfile) {
                let error = new Error('catalouge does not exist');
                error.status = 0;
                return next(error);
            }
        }

        const s3ItemImg = await uploadImage(image, shopItemBucket, `${shopID}/`);

        const item = new ShopItem({
            name: name,
            image_key: s3ItemImg.key,
            image_location: s3ItemImg.location,
            description: description,
            price: price,
            quantity: quantity,
            promo_price: promoPrice,
            category: category,
            shop_id: shopID
        })

        await item.save();

        return res.json({
            status: 1,
            message: 'success'
        });


    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }

}

// export const get = async (req, res, next) => {
//     const validationErr = validator.validationResult(req);

//     if (!validationErr.isEmpty()) {
//         let err = new Error(validationErr.errors[0].msg);
//         err.status = 0;
//         return next(err);
//     }

// }
