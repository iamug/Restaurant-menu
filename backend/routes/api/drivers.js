const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const pug = require("pug");
const {
  devTransporter,
  ProdTransporter,
} = require("../../utils/emailController");
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");

// render
//var html = pug.render('string of pug', merge(options, locals));

const Driver = require("../../models/Drivers");
const Module = "Drivers";

// @route   GET api/retrievals/me
// @desc    Get current drivers vehicle retrieval
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const drivers = await Driver.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    if (!drivers) {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.json({ success: true, drivers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me/total
// @desc    Get current drivers total order amount
// @access  Private
router.get("/total", auth, async (req, res) => {
  try {
    const drivers = await Driver.find().count();
    if (drivers == 0) {
      return res.json({ total: 0 });
    }
    res.json({ total: drivers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/retrievals/me
// @desc    Get current drivers vehicle retrieval
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select("-password")
      .lean();
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    res.json({ success: true, driver });
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
    let driver = await Driver.findByIdAndRemove(req.params.id);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    Logger(
      req,
      Module,
      req.method || "DELETE",
      req.params.id,
      `Admin deleted a record with id ${req.params.id} and name ${driver.name}`
    );
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
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let driverData = await Driver.findById(req.params.id);
  if (!driverData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  const { firstName, lastName, email, phone, verified } = req.body;
  firstName && (updateFields.firstName = firstName);
  lastName && (updateFields.lastName = lastName);
  email && (updateFields.email = email);
  phone && (updateFields.phone = phone);
  verified !== undefined && (updateFields.verified = verified);
  try {
    let driver = await Driver.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method || "UPDATE",
      req.params.id,
      `Admin updated a record with id ${req.params.id} and name ${driver.name}`
    );
    return res.json({ success: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
