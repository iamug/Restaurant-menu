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
} = require("../../../utils/emailController");
const auth = require("../../../middleware/auth");

// render
//var html = pug.render('string of pug', merge(options, locals));

const User = require("../../../models/Users");

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    if (!users) {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.json({ success: true, users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me/total
// @desc    Get current users total order amount
// @access  Private
router.get("/total", auth, async (req, res) => {
  try {
    const users = await User.find().count();
    if (users == 0) {
      return res.json({ total: 0 });
    }
    res.json({ total: users });
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
    let user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
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

// @route  POST api/users
// @desc   Register route
// @access Public
router.post(
  "/",
  [
    check("email", "Please include valid Email address").isEmail().notEmpty(),
    check("phone", "Please include valid Phone number").notEmpty(),
    check("firstName", "Please include valid Firstname").notEmpty(),
    check("lastName", "Please include valid Lastname").notEmpty(),
    check("category", "Please include valid Category").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, phone, category, verified } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      let userPhone = await User.findOne({ phone });
      if (userPhone) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Phone Number already exists" }] });
      }
      const d = new Date();
      let userId =
        "CMUSER" +
        d.getFullYear() +
        d.getMonth() +
        d.getDate() +
        "-" +
        (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
      let insertData = { userId, firstName, lastName, email, phone, category };
      verified && (insertData.verified = verified);
      user = new User(insertData);
      await user.save();
      res.status(201).send({ success: true });
    } catch (err) {
      console.log(err);
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let userData = await User.findById(req.params.id);
  if (!userData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  const { name, slug, email, phone, isActive, isVerified } = req.body;
  name && (updateFields.name = name);
  slug && (updateFields.slug = slug);
  email && (updateFields.email = email);
  phone && (updateFields.phone = phone);
  isActive !== undefined && (updateFields.isActive = isActive);
  isVerified !== undefined && (updateFields.isVerified = isVerified);
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    return res.json({ success: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
