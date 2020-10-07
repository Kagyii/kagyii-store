import ShopItem from '../models/shop-item.js';
import ShopProfile from '../models/shop-profile.js';
import { uploadImage } from '../aws/s3.js';

const shopItemBucket = 'kagyii-store-shop-item';

export const add = async (req, res, next) => {

    const name = req.body.name;
    const images = req.body.images;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const category = req.body.category;
    const shopID = req.params.shop_id;

    let promo = {};

    if (req.body.promo_percentage && req.body.promo_expiry_date && req.body.promo_price) {
        promo = {
            price: req.body.promo_price,
            percentage: req.body.promo_percentage,
            expiry_date: req.body.promo_expiry_date
        };
    }

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

        const s3ItemImg = await uploadImage(images, shopItemBucket, `${shopID}/`);

        const item = new ShopItem({
            name: name,
            images: s3ItemImg,
            description: description,
            price: price,
            quantity: quantity,
            promo: promo,
            category: category,
            shop_id: shopID
        });

        await item.save();

        return res.json({
            status: 1,
            message: 'success',
            s3ItemImg,
            promo
        });


    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }

};

export const get = async (req, res, next) => {

    const shopID = req.params.shop_id;
    const lastItem = req.query.last_item;
    const category = req.query.category;
    const pageSize = 20;

    let query;

    if (category) {
        if (lastItem) {
            query = ShopItem.find({ category: category, _id: { $gt: lastItem } });
        } else {
            query = ShopItem.find({ category: category });
        }
    } else {
        if (lastItem) {
            query = ShopItem.find({ _id: { $gt: lastItem } });
        } else {
            query = ShopItem.find({});
        }
    }

    try {
        const shopItem = await query.sort({ createdAt: -1 }).limit(pageSize).exec();

        return res.json({
            status: 1,
            message: 'success',
            data: shopItem
        });
    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }
};
