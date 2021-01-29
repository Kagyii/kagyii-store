import ShopItem from "../models/shop-item.js";
import Order from "../models/order.js";

export const create = async (req, res, next) => {
  const cart = req.body.cart;
  const shopId = req.body.shop_id;
  const cartTotalBill = req.body.total_bill;
  const address = req.body.address;
  const customerExtraInfo = req.body.customer_extra_info;

  const nowDate = new Date();
  const profileId = req.user_info.profile_id;

  const itemIds = [];
  cart.forEach((item) => {
    itemIds.push(item.id);
  });

  try {
    const shopItem = await ShopItem.find({
      _id: { $in: itemIds },
      shop_id: shopId,
    }).exec();

    if (shopItem.length !== cart.length) {
      return next(new Error("invalid item"));
    }

    let totalBill = 0;
    const orderItems = [];

    shopItem.forEach((item) => {
      const cartItem = cart.find((value) => value.id == item._id);

      const orderItem = {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItem.quantity,
      };

      if (item.promo.expiry > nowDate) {
        orderItem.promo_price = item.promo.price;
        orderItem.promo_percentage = item.promo.percentage;
        orderItem.bill = orderItem.promo_price * cartItem.quantity;
      } else {
        orderItem.bill = orderItem.price * cartItem.quantity;
      }

      if (cartItem.bill !== orderItem.bill) {
        return next(new Error("wrong bill"));
      }

      orderItems.push(orderItem);

      totalBill = totalBill + orderItem.bill;
    });

    if (totalBill !== cartTotalBill) {
      return next(new Error("wrong total bill"));
    }

    const order = await new Order({
      items: orderItems,
      customer_id: profileId,
      shop_id: shopId,
      address: address,
      customer_extra_info: customerExtraInfo || "",
      total_bill: totalBill,
    }).save();

    return res.json({
      status: 1,
      message: "success",
      data: order,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};

export const get = async (req, res, next) => {
  const accType = req.query.acc_type;
  const filter = req.query.filter;
  const pageSize = 5;

  let findWith = {};

  if (accType === "shop") {
    findWith.shop_id = req.user_info.shop_id;
  } else if (accType === "customer") {
    findWith.customer_id = req.user_info.profile_id;
  }

  if (filter) {
    if (filter.order_state) {
      findWith.accepted = filter.order_state;
    }

    if (filter.latest) {
      findWith.createdAt = filter.latest;
    }
  }

  try {
    const orders = await Order.find(findWith)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .populate({ path: "customer_id", select: "name phone" })
      .exec();
    return res.json({
      status: 1,
      message: "success",
      data: orders,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};

// export const remove = async (req, res, next) => {
//   const orderId = req.params.order_id;
//   const customerId = req.body.customer_id;

//   try {
//     const order = await Order.findOneAndDelete({
//       _id: orderId,
//       customer_id: customerId,
//     }).exec();
//     return res.json({
//       status: 1,
//       message: "success",
//       data: order,
//     });
//   } catch (err) {
//     console.log(err);
//     return next(new Error("internal error"));
//   }
// };

export const accept = async (req, res, next) => {
  const orderId = req.params.order_id;
  const shopId = req.body.shop_id;
  const accepted = req.body.accepted;
  const shopExtraInfo = req.body.shop_extra_info;

  if (shopId != req.user_info.shop_id) {
    return next(new Error("not authorized shop"));
  }

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, shop_id: shopId },
      { accepted: accepted, shop_extra_info: shopExtraInfo || "" },
      { new: true }
    ).exec();
    return res.json({
      status: 1,
      message: "success",
      data: order,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};
