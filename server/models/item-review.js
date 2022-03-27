import mongoose from "mongoose";

const shopItemReviewSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Types.ObjectId, required: true },
    shop_id: { type: mongoose.Types.ObjectId, required: true },
    rating: { type: Number, required: true },
    review: { type: String },
  },
  { timestamps: true }
);

const shopItemReview = mongoose.model("shop_item_review", shopItemReviewSchema);

export default shopItemReview;
