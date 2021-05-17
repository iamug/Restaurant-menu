const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    tableId: {
      type: String,
      required: true,
      unique: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    tableCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tableCategorys",
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

module.exports = Table = mongoose.model("tables", TableSchema);
