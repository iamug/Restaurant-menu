const mongoose = require("mongoose");

const TableCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TableCategory = mongoose.model(
  "tableCategorys",
  TableCategorySchema
);
