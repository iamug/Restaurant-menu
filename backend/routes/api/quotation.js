const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Quotation = require("../../models/Quotation");
//const { query } = require("express");

// @route   GET api/quotation/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const quotation = await Quotation.find()
      .sort({
        date_created: -1,
      })
      .lean();
    if (!quotation) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, quotation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/quotation/:id
// @desc    Get current users profile
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.find({
      quotationId: req.params.id,
    }).lean();
    if (!quotation)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    if (quotation.length == 0)
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    res.json({ success: true, quotation });
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
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let quotation = await Quotation.findOneAndRemove({
      quotationId: req.params.id,
    });
    if (!quotation) {
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
  let { status, userId, bookingId, amount } = req.body;
  if (!amount && !bookingId && !userId) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const d = new Date();
  let quotationId =
    "CMQUT" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { userId, bookingId, amount, quotationId };
  insertData.creator = req.user.id;
  status && (insertData.status = status);
  try {
    let quotation = new Quotation(insertData);
    quotation = await quotation.save();
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
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let { status, userId, bookingId, amount } = req.body;
  let quotationData = await Quotation.findOne({ quotationId: req.params.id });
  if (!quotationData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  status && (updateFields.status = status);
  userId && (updateFields.userId = userId);
  bookingId && (updateFields.bookingId = bookingId);
  amount && (updateFields.amount = amount);
  try {
    let quotation = await Quotation.findOneAndUpdate(
      { quotationId: req.params.id },
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
