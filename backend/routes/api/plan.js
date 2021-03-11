const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Plan = require("../../models/Plan");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Plan";

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/", async (req, res) => {
  //console.log(req.user.id);
  q = {};
  if (req.query.cat) {
    q = { planCategory: { $in: req.query.cat } };
  }
  console.log(req.query);
  let cat = req.query.cat || null;
  try {
    const plan = await Plan.find(q)
      .select("-date_created -creator -updatedAt -createdAt -_id")
      .sort({
        date_created: -1,
      })
      .lean();
    if (!plan) {
      return res.status(400).json({ msg: "There is no plan for this user" });
    }
    res.json({ success: true, plan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/plan/
// @desc    Get current users profile
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const plan = await Plan.find({ planId: req.params.id })
      .select("-date_created -creator -updatedAt -createdAt -_id")
      .lean();
    if (!plan)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    if (plan.length == 0)
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    res.json({ success: true, plan });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", auth, async (req, res) => {
  let {
    planName,
    planStatus,
    planCategory,
    classCategory,
    maxCars,
    price,
    planDescription,
  } = req.body;
  if (!planName && !planCategory && !price && !maxCars) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let insertData = { planName, planCategory, price, classCategory };
  planStatus && (insertData.planStatus = planStatus);
  planDescription && (insertData.planDescription = planDescription);
  maxCars && (insertData.maxCars = maxCars);
  const d = new Date();
  let planId =
    "CMPLAN" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  insertData.creator = req.user.id;
  insertData.planId = planId;
  try {
    let plan = new Plan(insertData);
    plan = await plan.save();
    Logger(
      req,
      Module,
      req.method,
      plan.id,
      `Admin created a record with id ${plan.id}`
    );
    res.status(201).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/plans/:id
// @desc   Delete plans route
// @access Private
// @Params  id -- id of plan
router.delete("/:id", auth, async (req, res) => {
  console.log(req.params.id);
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let plan = await Plan.findOneAndRemove({ planId: req.params.id });
    if (!plan) {
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

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let planData = await Plan.findOne({ planId: req.params.id });
  if (!planData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  req.body.planName && (updateFields.planName = req.body.planName);
  req.body.planStatus && (updateFields.planStatus = req.body.planStatus);
  req.body.planCategory && (updateFields.planCategory = req.body.planCategory);
  req.body.maxCars && (updateFields.maxCars = req.body.maxCars);
  req.body.price && (updateFields.price = req.body.price);
  req.body.planDescription &&
    (updateFields.planDescription = req.body.planDescription);
  console.log({ updateFields });
  try {
    let plan = await Plan.findOneAndUpdate(
      { planId: req.params.id },
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
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
