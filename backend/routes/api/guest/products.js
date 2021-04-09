const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../../models/Users");
const Product = require("../../../models/Products");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/:user", async (req, res) => {
  try {
    const userdata = await User.findOne({ slug: req.params.user }).lean();
    if (!userdata)
      return res.status(404).json({ msg: "Record does not exist" });
    const products = await Product.find({ creator: userdata._id })
      .populate("productCategory")
      .sort({ createdAt: -1 })
      .lean();
    if (!products) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
