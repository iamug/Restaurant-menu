const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    productCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorys",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product = mongoose.model("products", ProductSchema);
