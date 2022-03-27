import mongoose from "mongoose";

const shopReviewSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Types.ObjectId, required: true },
    shop_id: { type: mongoose.Types.ObjectId, required: true },
    rating: { type: Number, required: true },
    review: { type: String },
  },
  { timestamps: true }
);

export const ShopReview = mongoose.model("shop_review", shopReviewSchema);

const shopReviewReplySchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    reply: { type: String, required: true },
    review_id: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const ShopReviewReply = mongoose.model(
  "shop_review_reply",
  shopReviewReplySchema
);
