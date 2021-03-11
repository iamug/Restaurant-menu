const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Transaction = require("../../models/Transactions");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Transactions";

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .lean();
    if (!transactions) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/earnings/delete
// @desc   Earnings route
// @access Private
router.delete("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let transaction = await Transaction.findByIdAndRemove(req.params.id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin deleted a record with id ${req.params.id}`
    );
    res.status(200).send({ deleted: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let { status, comments } = req.body;
  let transactionData = await Transaction.findById(req.params.id);
  if (!transactionData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  status && (updateFields.status = status);
  comments && (updateFields.comments = comments);
  try {
    transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${transaction.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
