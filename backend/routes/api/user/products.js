const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../../middleware/auth");
const Product = require("../../../models/Products");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find({ creator: req.user.id })
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

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/guest", async (req, res) => {
  try {
    const products = await Product.find({ isEnabled: true })
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

// @route   GET api/payment/:id
// @desc    Get current users profile
// @access  Private
// router.get("/:id", async (req, res) => {
//   try {
//     const payment = await Product.find({
//       paymentId: req.params.id,
//     }).lean();
//     if (!payment)
//       return res.status(400).json({ success: false, msg: "Invalid request" });
//     if (payment.length == 0)
//       return res
//         .status(404)
//         .json({ success: false, msg: "Record does not exist" });
//     res.json({ success: true, payment });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route  DELETE api/plans/:id
// @desc   Delete plans route
// @access Private
// @Params  id -- id of plan
router.delete("/:id", auth, async (req, res) => {
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let payment = await Product.findOneAndRemove({
      _id: req.params.id,
      creator: req.user.id,
    });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", auth, async (req, res) => {
  let { name, imageUrl, description, isEnabled } = req.body;
  let { productCategory, price } = req.body;
  if (!name || !imageUrl || !description || !productCategory) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let productId = generateId("PROD");
  let insertData = { productId, name, imageUrl, description, productCategory };
  insertData.creator = req.user.id;
  isEnabled && (insertData.isEnabled = isEnabled);
  price && (insertData.price = price);
  try {
    let product = await new Product(insertData).save();
    res.status(201).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  let { name, imageUrl, description, isEnabled } = req.body;
  let { productCategory, price } = req.body;
  let productData = await Product.findById(req.params.id);
  if (!productData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  imageUrl && (updateFields.imageUrl = imageUrl);
  description && (updateFields.description = description);
  productCategory && (updateFields.productCategory = productCategory);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  price && (updateFields.price = price);
  try {
    let product = await Product.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      { $set: updateFields },
      { new: true }
    );
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
