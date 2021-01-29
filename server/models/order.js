import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: { type: [Object], required: true },
    total_bill: { type: Number, required: true },
    accepted: { type: Boolean, default: false },
    valid: { type: Boolean, default: true },
    customer_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user_profile",
    },
    shop_id: { type: mongoose.Types.ObjectId, required: true },
    address: { type: String, required: true },
    customer_extra_info: { type: String },
    shop_extra_info: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

export default Order;
