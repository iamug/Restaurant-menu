const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Order = require("../../../models/Orders");
const { generateId, validMongooseId } = require("../../../utils/utils");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: "products",
        populate: { path: "productCategory" },
      })
      .sort({ createdAt: -1 })
      .lean();
    if (!orders) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route   GET api/payment/
// // @desc    Get current users profile
// // @access  Private
// router.get("/", auth, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id,})
//       .populate("user")
//       .populate({
//         path: "products",
//         populate: { path: "productCategory" },
//       })
//       .sort({ createdAt: -1 })
//       .lean();
//     if (!orders) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json({ success: true, orders });
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
    let order = await Order.findOneAndRemove({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!order) {
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
// router.post("/", auth, async (req, res) => {
//   let { tableName, products, isCompleted, user } = req.body;
//   if (!tableName || !user || !products) {
//     return res.status(400).json({ success: false, msg: "Invalid request" });
//   }
//   let orderId = generateId("PROD");
//   let insertData = { orderId, tableName, products, user };
//   isCompleted && (insertData.isCompleted = isCompleted);
//   try {
//     let order = await new Order(insertData).save();
//     res.status(201).send({ success: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  let { tableName, products, isCompleted } = req.body;
  let orderData = await Order.findById(req.params.id);
  if (!orderData)
    return res
      .status(404)
      .send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  isCompleted !== undefined && (updateFields.isCompleted = isCompleted);
  tableName && (updateFields.tableName = tableName);
  products && (updateFields.products = products);
  try {
    let product = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
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
