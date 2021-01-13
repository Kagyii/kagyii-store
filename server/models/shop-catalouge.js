import mongoose from "mongoose";

const shopCatalougeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shop_id: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamp: true }
);

const ShopCatalouge = mongoose.model("shop_catalouge", shopCatalougeSchema);

export default ShopCatalouge;
