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
            data: item
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
        const shopItems = await query.sort({ createdAt: -1 }).limit(pageSize).lean().exec();

        if (category === undefined && catalouge !== undefined) {
            shopItems.forEach((item, i) => {
                const categoryArr = [];
                if (item.category.length !== 0) {
                    item.category.forEach((categoryID) => {
                        catalouge.forEach((categoryObj, j) => {
                            if (categoryObj._id == categoryID) {
                                categoryArr.push(categoryObj);
                            }
                        });

                    });
                    shopItems[i].category = categoryArr;
                }
            });
        }

        return res.json({
            status: 1,
            message: 'success',
            data: shopItems
        });
    } catch (err) {
        console.log(err);
        let error = new Error('some errors');
        error.status = 0;
        return next(error);
    }
};
