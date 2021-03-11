const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Ticket";
const Ticket = require("../../models/Tickets");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
    if (!tickets) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/recent", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: "Open" })
      .sort({ date_created: -1 })
      .limit(6)
      .lean();
    if (!tickets) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(tickets);
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
    let ticket = await Ticket.findOneAndRemove({ _id: req.params.id });
    if (!ticket) {
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

// @route  POST api/earnings/delete
// @desc   Earnings route
// @access Private
router.post("/", auth, async (req, res) => {
  let { issuer, ticketCategory, subject, description } = req.body;
  let { assignedAdmin, status, response, issuerId, issuerEmail } = req.body;
  if (!issuerId && !subject) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let ticketId =
    "TICK" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { ticketId, issuerId, subject };
  ticketCategory && (insertData.ticketCategory = ticketCategory);
  description && (insertData.description = description);
  assignedAdmin && (insertData.assignedAdmin = assignedAdmin);
  status && (insertData.status = status);
  response && (insertData.response = response);
  issuer && (insertData.issuer = issuer);
  issuerEmail && (insertData.issuerEmail = issuerEmail);
  insertData.creator = req.user.id;
  try {
    let ticket = await new Ticket(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      ticket.id,
      `Admin created a record with id ${ticket.id}`
    );
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
  let { issuer, ticketCategory, subject, description } = req.body;
  let { assignedAdmin, status, response } = req.body;
  if (!issuer && !subject) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let ticketData = await Ticket.findOne({ _id: req.params.id });
  if (!ticketData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  const d = new Date();
  let ticketId =
    "TICK" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let updateFields = { issuer, subject };
  ticketData.ticketId === undefined && (updateFields.ticketId = ticketId);
  ticketCategory && (updateFields.ticketCategory = ticketCategory);
  description && (updateFields.description = description);
  assignedAdmin && (updateFields.assignedAdmin = assignedAdmin);
  status && (updateFields.status = status);
  response && (updateFields.response = response);
  try {
    ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${ticket.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
