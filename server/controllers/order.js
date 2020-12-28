import ShopItem from '../models/shop-item.js';
import Order from '../models/order.js';

export const create = async (req, res, next) => {

    const userId = req.decoded_token.userID;
    const cart = req.body.cart;
    const shopId = req.body.shop_id;
    const cartTotalBill = req.body.total_bill;
    const nowDate = new Date();

    const itemIds = [];
    cart.forEach(item => {
        itemIds.push(item.id);
    });

    try {
        const shopItem = await ShopItem.find({ _id: { $in: itemIds }, shop_id: shopId }).exec();

        if (shopItem.length !== cart.length) {
            return next(new Error('invalid item'));
        }

        let totalBill = 0;
        const orderItems = [];

        shopItem.forEach(item => {
            const cartItem = cart.find(value => value.id == item._id);

            const orderItem = {
                id: item._id,
                name: item.name,
                price: item.price,
                quantity: cartItem.quantity
            };

            if (item.promo.expiry > nowDate) {

                orderItem.promo_price = item.promo.price;
                orderItem.promo_percentage = item.promo.percentage;
                orderItem.bill = orderItem.promo_price * cartItem.quantity;
            } else {
                orderItem.bill = orderItem.price * cartItem.quantity;
            }

            if (cartItem.bill !== orderItem.bill) {
                return next(new Error('wrong bill'));
            }

            orderItems.push(orderItem);

            totalBill = totalBill + orderItem.bill;
        });

        if (totalBill !== cartTotalBill) {
            return next(new Error('wrong total bill'));
        }

        const order = new Order({
            items: orderItems,
            customer_id: userId,
            shop_id: shopId,
            total_bill: totalBill
        });

        const orderResult = await order.save();

        return res.json({
            status: 1,
            message: 'success',
            data: orderResult
        });


    } catch (err) {
        console.log(err);
        return next(new Error("database error"));
    }


};