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
    const orders = await Order.find()
      .populate("user")
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

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  let { user } = req.body;
  let orderData = await Order.findById(req.params.id);
  if (!orderData)
    return res
      .status(404)
      .send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  user && (updateFields.user = user);
  try {
    let product = await Order.findOneAndUpdate(
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
