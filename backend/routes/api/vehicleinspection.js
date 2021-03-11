const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const VehicleInspection = require("../../models/VehicleInspection");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "VehicleInspection";

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const vehicleinspection = await VehicleInspection.find()
      .sort({ date_created: -1 })
      .lean();
    if (!vehicleinspection) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(vehicleinspection);
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
    let vehicleinspection = await VehicleInspection.findOneAndRemove({
      inspectionId: req.params.id,
    });
    if (!vehicleinspection) {
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
  let { status, inspectionCenter, inspectionCenterAddress } = req.body;
  let { certificateUrl, partner, partnerEmail, vin } = req.body;
  let { comments, plateNo, inspectionDate } = req.body;
  if (
    !inspectionCenter &&
    !inspectionCenterAddress &&
    !inspectionDate &&
    !partner &&
    !partnerEmail &&
    !vin &&
    !plateNo
  ) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let inspectionId =
    "CMINSP" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = {
    inspectionCenter,
    inspectionCenterAddress,
    inspectionDate,
  };
  insertData = {
    ...insertData,
    partner,
    partnerEmail,
    vin,
    plateNo,
    inspectionId,
  };
  status && (insertData.status = status);
  comments && (insertData.comments = comments);
  certificateUrl && (insertData.certificateUrl = certificateUrl);
  try {
    let inspection = await new VehicleInspection(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      inspection.id,
      `Admin created a record with id ${inspection.id}`
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
  let {
    status,
    inspectionCenter,
    inspectionCenterAddress,
    comments,
  } = req.body;
  let {
    certificateUrl,
    partner,
    partnerEmail,
    vin,
    plateNo,
    inspectionDate,
  } = req.body;
  let inspectionData = await VehicleInspection.findOne({
    inspectionId: req.params.id,
  });
  if (!inspectionData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  status && (updateFields.status = status);
  inspectionCenter && (updateFields.inspectionCenter = inspectionCenter);
  inspectionCenterAddress &&
    (updateFields.inspectionCenterAddress = inspectionCenterAddress);
  inspectionDate && (updateFields.inspectionDate = inspectionDate);
  comments && (updateFields.comments = comments);
  vin && (updateFields.vin = vin);
  plateNo && (updateFields.plateNo = plateNo);
  partnerEmail && (updateFields.partnerEmail = partnerEmail);
  partner && (updateFields.partner = partner);
  certificateUrl && (updateFields.certificateUrl = certificateUrl);
  try {
    inspection = await VehicleInspection.findOneAndUpdate(
      { inspectionId: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${inspection.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
