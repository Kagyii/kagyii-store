import { ShopReview, ShopReviewReply } from "../models/shop-review.js";
import ShopProfile from "../models/shop-profile.js";

export const createReview = async (req, res, next) => {
  const rating = req.body.rating;
  const review = req.body.review;
  const customerId = req.body.customer_id;
  const shopId = req.body.shop_id;

  try {
    const shopReview = await new ShopReview({
      shop_id: shopId,
      customer_id: customerId,
      rating: rating,
      review: review,
    }).save();

    ShopProfile.updateOne({ _id: shopId }, {});

    return res.json({
      status: 1,
      message: "success",
      data: shopReview,
    });
  } catch (err) {
    console.log(err);
    return next(new Error("internal error"));
  }
};
