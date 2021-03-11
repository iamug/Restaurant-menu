const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const pug = require("pug");
const crypto = require("crypto");
const {
  devTransporter,
  ProdTransporter,
} = require("../../utils/emailController");

const User = require("../../models/Users");
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/", async (req, res) => {
  console.log(req.body.refcode);
  const user = await User.findOne({ referrer: req.body.refcode })
    .select("name email refcode referrer -_id")
    .lean();
  console.log(user);
  if (!user) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }
  return res.status(200).json({ user });
});

// fetch direct upline
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/up", async (req, res) => {
  console.log(req.body.refcode);
  const user = await User.findOne({ refcode: req.body.refcode })
    .select("referrer -_id")
    .lean();
  console.log(user.referrer);

  if (!user) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }
  return res.status(200).json({ user });
});

// fetch level 2 upline
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/up/l2", async (req, res) => {
  console.log(req.body.refcode);
  const l1 = await User.findOne({ refcode: req.body.refcode }).select(
    "referrer -_id"
  );
  console.log(l1);

  if (!l1) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }

  let l2 = [];

  console.log("l1.refcode");
  console.log(l1.referrer);
  const users = await User.find({ refcode: l1.referrer }).select(
    "referrer -_id"
  );
  console.log(users);
  users.forEach(function (item) {
    l2 = [...l2, item];
  });
  // l2.push(users);
  return res.status(200).json({ l2 });
});

// fetch level three upline
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/up/l3", async (req, res) => {
  console.log(req.body.refcode);
  const l1 = await User.findOne({ refcode: req.body.refcode }).select(
    "referrer -_id"
  );
  console.log(l1);

  if (!l1) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }

  let l2 = [];
  console.log("l1.refcode");
  console.log(l1.referrer);
  const users = await User.find({ refcode: l1.referrer }).select(
    "referrer -_id"
  );
  console.log(users);
  users.forEach(function (item) {
    l2 = [...l2, item];
  });
  // l2.push(users);
  //console.log(l2);
  let l3 = [];
  for (const item of l2) {
    // const contents = await fs.readFile(file, 'utf8');
    console.log("level 3");
    //console.log(item2);
    console.log(item.referrer);
    const users = await User.find({ refcode: item.referrer }).select(
      "referrer -_id"
    );
    users.forEach(function (item) {
      l3 = [...l3, item];
    });
    //l3.push(users);
  }

  return res.status(200).json({ l3 });
});

// fetch all level upline
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/up/all", async (req, res) => {
  console.log(req.body.refcode);
  let l1 = await User.findOne({ refcode: req.body.refcode })
    .select("referrer -_id")
    .lean();
  console.log(l1);
  l1 ? (l1 = l1.referrer) : null;

  if (!l1) {
    return res
      .status(200)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }

  //let l2 = {};
  let l2user, l3user, l4user, l2, l3, l4;
  if (l4) {
    console.log("works");
  }
  console.log("l1.refcode");
  console.log(l1.referrer);
  l2user = await User.findOne({ refcode: l1 }).select("referrer -_id").lean();
  if (l2user) {
    l2 = l2user.referrer;
    console.log("l2user");
    console.log(l2);
  }
  // l2.push(users);
  console.log(l2);
  //let l3 = {};
  console.log("level 3");
  //console.log(item2);
  //console.log(l2.referrer);
  if (l2 != undefined) {
    l3user = await User.findOne({ refcode: l2 }).select("referrer -_id").lean();
  }
  if (l3user) {
    l3 = l3user.referrer;
  }
  console.log("l3");
  console.log(l3);
  //l3.push(users);
  //let l4 = {};
  if (l3) {
    l4user = await User.findOne({ refcode: l3 }).select("referrer -_id").lean();
  }
  if (l4user) {
    l4 = l4user.referrer;
  }
  const upline = { l1: l1, l2: l2, l3: l3, l4: l4 };

  return res.status(200).json(upline);
});

// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/l2", async (req, res) => {
  console.log(req.body.refcode);
  const l1 = await User.find({ referrer: req.body.refcode }).select(
    "name email refcode referrer -_id"
  );
  if (!l1) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }
  let l2 = [];

  for (const item of l1) {
    // const contents = await fs.readFile(file, 'utf8');
    console.log(item.refcode);
    const users = await User.find({ referrer: item.refcode }).select(
      "name email refcode referrer -_id"
    );
    console.log(users);
    users.forEach(function (item) {
      l2 = [...l2, item];
    });
    // l2.push(users);
  }

  return res.status(200).json({ l2 });
});

//Level 3 referrals API
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/l3", async (req, res) => {
  console.log(req.body.refcode);
  const l1 = await User.find({ referrer: req.body.refcode }).select(
    "name email refcode referrer -_id"
  );
  if (!l1) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }

  let l2 = [];
  for (const item of l1) {
    // const contents = await fs.readFile(file, 'utf8');
    //console.log(item.refcode);
    const users = await User.find({ referrer: item.refcode }).select(
      "name email refcode referrer -_id"
    );
    //l2 = [...l2, item];
    users.forEach(function (item) {
      l2 = [...l2, item];
    });
  }
  console.log(l2);
  let l3 = [];
  for (const item of l2) {
    // const contents = await fs.readFile(file, 'utf8');
    console.log("level 3");
    //console.log(item2);
    console.log(item.refcode);
    const users = await User.find({ referrer: item.refcode }).select(
      "name email refcode referrer -_id"
    );
    users.forEach(function (item) {
      l3 = [...l3, item];
    });
    //l3.push(users);
  }

  /*
  async l1.forEach(function (item) {
    //x += item;
    const users = await User.find({ referrer: req.body.refcode }).select(
      "name email referrer -_id"
    );
    x.push(item);

    console.log(item.email);
  }); */
  //console.log(l2);
  return res.status(200).json({ l3 });
  //   try {
  //     const user = await User.findById(req.user.id).select("-password");
  //     console.log(user);
  //     res.json(user);
  //   } catch (err) {
  //     console.log(err.message);
  //     res.status(500).send("Server Error");
  //   }
});

//all levels downline referrals API
// @route   Get api/auth
// @desc    Test route
// @access  Public
router.post("/ref/down/all", async (req, res) => {
  console.log(req.body.refcode);
  const l1 = await User.find({ referrer: req.body.refcode })
    .select("name email refcode referrer -_id")
    .lean();
  if (!l1) {
    return res
      .status(404)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }
  let l2 = [];
  for (const item of l1) {
    const users = await User.find({ referrer: item.refcode })
      .select("name email refcode referrer -_id")
      .lean();
    users.forEach(function (item) {
      l2 = [...l2, item];
    });
  }
  let l3 = [];
  for (const item of l2) {
    const users = await User.find({ referrer: item.refcode })
      .select("name email refcode referrer -_id")
      .lean();
    users.forEach(function (item) {
      l3 = [...l3, item];
    });
    //l3.push(users);
  }
  let l4 = [];
  for (const item of l3) {
    const users = await User.find({ referrer: item.refcode })
      .select("name email refcode referrer -_id")
      .lean();
    users.forEach(function (item) {
      l4 = [...l4, item];
    });
    //l3.push(users);
  }
  return res.status(200).json({ l1, l2, l3, l4 });
});

module.exports = router;
