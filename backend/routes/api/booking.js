const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Booking = require("../../models/Booking");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Booking";
//const { query } = require("express");

// @route   GET api/booking/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({
        date_created: -1,
      })
      .lean();
    if (!bookings) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    // Logger(req, Module, req.method, "all", `Admin fetched all bookings`);
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/booking/
// @desc    Get current users profile
// @access  Private
router.get("/user/:userId/:bookingId?", async (req, res) => {
  if (req.params.bookingId !== undefined) {
    q = { userId: req.params.userId, bookingId: req.params.bookingId };
  } else {
    q = { userId: req.params.userId };
  }
  try {
    const bookings = await Booking.find(q)
      .sort({
        date_created: -1,
      })
      .lean();
    if (!bookings) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, bookings });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/booking/:id
// @desc    Get current users profile
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.find({
      bookingId: req.params.id,
    }).lean();
    if (!booking)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    if (booking.length == 0)
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    res.json({ success: true, booking });
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
    let booking = await Booking.findOneAndRemove({
      bookingId: req.params.id,
    });
    if (!booking) {
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
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/user", async (req, res) => {
  let { userId, itineraries } = req.body;
  if (!userId && !itineraries) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const d = new Date();
  let bookingId =
    "CMBKS" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 999999));
  let insertData = { userId, bookingId, itineraries };
  try {
    let booking = new Booking(insertData);
    booking = await booking.save();
    res.status(201).send({ success: true, booking });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/payment/user/:user", async (req, res) => {
  if (!req.params.user) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let { amount, reference, bookingId } = req.body;
  if (!amount && !reference && !bookingId) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const booking = await Booking.findOne({
    bookingId,
    userId: req.params.user,
  }).lean();
  if (!booking)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  if (booking.quotation && booking.quotation.id == undefined)
    res.status(400).send({ success: false, msg: "No quotation record" });
  const d = new Date();
  amount = parseInt(amount);
  let paymentId =
    "CMPAY" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 999999));
  let quotation = { ...booking.quotation };
  payment = { id: paymentId, reference, amount, date: d, amount };
  quotation.isPaid = booking.quotation.amount <= amount ? true : false;
  let updateFields = { payment, quotation };
  try {
    let bookingData = await Booking.findOneAndUpdate(
      { bookingId: bookingId },
      { $set: updateFields },
      { new: true }
    );
    return res.json({ success: true, booking: bookingData });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", auth, async (req, res) => {
  let { status, planId, userId } = req.body;
  let { vehicles, itineraries } = req.body;
  if (!planId && !userId && !vehicles && !itineraries && vehicles.length == 0) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const d = new Date();
  let bookingId =
    "CMBKS" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 999999));
  let insertData = { userId, planId, vehicles, itineraries };
  insertData.creator = req.user.id;
  insertData.bookingId = bookingId;
  status && (insertData.status = status);
  try {
    let booking = new Booking(insertData);
    booking = await booking.save();
    res.status(201).send({ success: true, booking });
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
  let { status, planId, userId, quotation } = req.body;
  let { vehicles, itineraries } = req.body;
  let bookingData = await Booking.findOne({ bookingId: req.params.id });
  if (!bookingData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  updateFields.quotation = {};
  const d = new Date();
  if (quotation && quotation.amount && bookingData.quotation.id == undefined) {
    let quotationId =
      "CMQUT" +
      d.getFullYear() +
      d.getMonth() +
      d.getDate() +
      "-" +
      (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 999999));
    updateFields.quotation.id = quotationId;
    updateFields.quotation.date = d;
  }
  quotation &&
    quotation.amount &&
    (updateFields.quotation.amount = quotation.amount);
  if (
    quotation &&
    quotation.amount &&
    bookingData.payment.amount !== undefined &&
    bookingData.quotation.amount !== undefined
  ) {
    updateFields.quotation.isPaid =
      quotation.amount <= bookingData.payment.amount ? true : false;
  }
  status && (updateFields.status = status);
  userId && (updateFields.userId = userId);
  planId && (updateFields.planId = planId);
  vehicles && (updateFields.vehicles = vehicles);
  itineraries && (updateFields.itineraries = itineraries);
  try {
    let booking = await Booking.findOneAndUpdate(
      { bookingId: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${req.params.id}`
    );
    return res.json({ success: true, booking });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
