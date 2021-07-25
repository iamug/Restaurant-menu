const express = require("express");
const router = express.Router();
const User = require("../../../models/Users");
const Product = require("../../../models/Products");
const Table = require("../../../models/Tables");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/:user/:table?", async (req, res) => {
  let productQuery, table;
  try {
    const userdata = await User.findOne({ slug: req.params.user })
      .select("name slug email phone bannerImg _id")
      .lean();
    if (!userdata)
      return res.status(404).json({ msg: "Record does not exist" });
    if (req.params.table) {
      table = await Table.findOne({
        creator: userdata._id,
        tableName: req.params.table,
      })
        .select("tableCategory _id")
        .lean();
    }
    if (table && table.tableCategory) {
      productQuery = {
        creator: userdata._id,
        isEnabled: true,
        tableCategory: { $in: table.tableCategory },
      };
    } else {
      productQuery = { creator: userdata._id, isEnabled: true };
    }
    const products = await Product.find(productQuery)
      .populate("productCategory")
      .populate("tableCategory", "name")
      .sort({ name: 1 })
      .lean();
    if (!products) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, user: userdata, products });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
