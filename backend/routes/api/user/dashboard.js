const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Product = require("../../../models/Products");
const Order = require("../../../models/Orders");
const Table = require("../../../models/Tables");

// @route   GET api/orders/me/total
// @desc    Get current drivers total order amount
// @access  Private
router.get("/totalsummary", auth, async (req, res) => {
  try {
    let q = { creator: req.user.id };
    const products = await Product.find(q).countDocuments();
    const orders = await Order.find({ user: req.user.id }).countDocuments();
    const tables = await Table.find(q).countDocuments();
    let total = { products, orders, tables };
    res.json(total);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/recentorders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .select("createdAt tableName isCompleted")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/recentproducts", auth, async (req, res) => {
  try {
    let q = { creator: req.user.id };
    const products = await Produt.find({ creator: req.user.id })
      .select(" name productCategory isEnabled ")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    return res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
