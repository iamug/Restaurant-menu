const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Roles";
const Role = require("../../models/Roles");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const roles = await Role.find().sort({ date_created: -1 }).lean();
    if (!roles) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(roles);
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
    let role = await Role.findByIdAndRemove(req.params.id);
    if (!role) {
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
  let { name, permissions, isEnabled } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let roleId =
    "ROLE" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { roleId, name };
  insertData.creator = req.user.id;
  permissions &&
    typeof permissions === "object" &&
    (insertData.permissions = permissions);
  isEnabled && (insertData.isEnabled = isEnabled);
  try {
    let role = await new Role(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      role.id,
      `Admin created a record with id ${role.id}`
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
  let { name, permissions, isEnabled } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let roleData = await Role.findById(req.params.id);
  if (!roleData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  permissions &&
    typeof permissions === "object" &&
    (updateFields.permissions = permissions);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  try {
    role = await Role.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${role.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
