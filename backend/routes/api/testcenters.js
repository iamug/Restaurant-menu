const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "TestCenters";
const TestCenter = require("../../models/TestCenter");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const testcenters = await TestCenter.find()
      .sort({ date_created: -1 })
      .lean();
    if (!testcenters) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(testcenters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route   GET api/orders/me
// // @desc    Get current users orderss
// // @access  Private
// router.get("/user", async (req, res) => {
//   try {
//     const testcenters = await TestCenter.find({ isEnabled: true })
//       .sort({ date_created: -1 })
//       .lean();
//     if (!testcenters) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json(testcenters);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/user", async (req, res) => {
  try {
    const testcenters = await TestCenter.find({ isEnabled: true })
      .sort({ date_created: -1 })
      .select(" -creator -_id")
      .lean();
    if (!testcenters) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, testcenters });
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
    let testcenter = await TestCenter.findOneAndRemove({
      testCenterId: req.params.id,
    });
    if (!testcenter) {
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
  let testCenterId =
    "TSTCTR" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { testCenterId, name, address, slotsPerDay };
  insertData.creator = req.user.id;
  isEnabled && (insertData.isEnabled = isEnabled);
  try {
    let testcenter = await new TestCenter(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      testcenter.id,
      `Admin created a record with id ${testcenter.id}`
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
  let testCenterData = await TestCenter.findOne({
    testCenterId: req.params.id,
  });
  if (!testCenterData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  address && (updateFields.address = address);
  slotsPerDay && (updateFields.slotsPerDay = slotsPerDay);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  try {
    testcenter = await TestCenter.findOneAndUpdate(
      { testCenterId: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${testcenter.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
