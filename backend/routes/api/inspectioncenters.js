const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const InspectionCenter = require("../../models/InspectionCenter");
const Module = "InspectionCenters";

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const inspectioncenter = await InspectionCenter.find()
      .sort({ date_created: -1 })
      .lean();
    if (!inspectioncenter) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(inspectioncenter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/user", async (req, res) => {
  try {
    const inspectioncenter = await InspectionCenter.find({ isEnabled: true })
      .sort({ date_created: -1 })
      .select(" -creator -_id")
      .lean();
    if (!inspectioncenter) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, inspectioncenter });
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
    let insoectioncenter = await InspectionCenter.findOneAndRemove({
      centerId: req.params.id,
    });
    if (!insoectioncenter) {
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
  let { name, address, slotsPerDay, isEnabled } = req.body;
  if (!name && !address && !slotsPerDay) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let centerId =
    "ISPCTR" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { centerId, name, address, slotsPerDay };
  insertData.creator = req.user.id;
  isEnabled && (insertData.isEnabled = isEnabled);
  try {
    let inspectioncenter = await new InspectionCenter(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      inspectioncenter.id,
      `Admin created a record with id ${inspectioncenter.id}`
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
  let { name, address, slotsPerDay, isEnabled } = req.body;
  if (!name && !address && !slotsPerDay) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let centerData = await InspectionCenter.findOne({
    centerId: req.params.id,
  });
  if (!centerData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  address && (updateFields.address = address);
  slotsPerDay && (updateFields.slotsPerDay = slotsPerDay);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  try {
    inspectioncenter = await InspectionCenter.findOneAndUpdate(
      { centerId: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${inspectioncenter.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
