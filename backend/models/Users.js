const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("users", UserSchema);
