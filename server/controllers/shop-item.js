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

    if (req.body.promo_percentage && req.body.promo_expiry && req.body.promo_price) {
        promo = {
            price: req.body.promo_price,
            percentage: req.body.promo_percentage,
            expiry: req.body.promo_expiry
        };
    }

    if (shopID != req.shop_id) {
        let error = new Error('permission error');
        error.status = 0;
        return next(error);
    }


    try {
        const s3ItemImg = await uploadImage(images, shopItemBucket, `${shopID}/`);

        if (promo !== {}) {
            await ShopProfile.updateOne({ _id: shopID },
                { promo_percentage: req.body.promo_percentage, promo_expiry: req.body.promo_expiry });
        }

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
            data: item
        });


    } catch (err) {
        console.log(err);
        return next(new Error("database error"));
    }

};

export const get = async (req, res, next) => {

    const shopID = req.params.shop_id;
    const lastItem = req.query.last_item;
    const category = req.query.category;
    const catalougeString = req.query.catalouge;
    const pageSize = 20;

    let catalouge;
    if (catalougeString) {
        catalouge = JSON.parse(catalougeString);
    }


    let query;

    if (category) {
        if (lastItem) {
            query = ShopItem.find({ category: category, shop_id: shopID, _id: { $gt: lastItem } });
        } else {
            query = ShopItem.find({ category: category, shop_id: shopID });
        }
    } else {
        if (lastItem) {
            query = ShopItem.find({ shop_id: shopID, _id: { $gt: lastItem } });
        } else {
            query = ShopItem.find({ shop_id: shopID });
        }
    }

    try {
        const shopItems = await query.sort({ createdAt: -1 }).limit(pageSize)
            .populate({ path: 'category', select: 'name' }).exec();

        return res.json({
            status: 1,
            message: 'success',
            data: shopItems
        });
    } catch (err) {
        console.log(err);
        return next(new Error("database error"));
    }
};
