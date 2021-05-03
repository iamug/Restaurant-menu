const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Order = mongoose.model("orders", OrderSchema);
