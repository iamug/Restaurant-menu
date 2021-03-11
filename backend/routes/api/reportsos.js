const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "ReportSOS";
const ReportSOS = require("../../models/ReportSos");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const reports = await ReportSOS.find().sort({ createdAt: -1 }).lean();
    if (!reports) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(reports);
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
    let reports = await ReportSOS.findByIdAndRemove(req.params.id);
    if (!reports) {
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
// router.post("/", auth, async (req, res) => {
//   let { status, vehicleId } = req.body;
//   let { location, locationName, imgUrl, comments } = req.body;
//   if (!issuer && !issueNoticed && !imgUrl && locationName && issuerEmail) {
//     return res.status(400).json({ msg: "Invalid request" });
//   }
//   if (!carDescription && !location && !location.lat && location.long) {
//     return res.status(400).json({ msg: "Invalid request" });
//   }
//   const d = new Date();
//   let requestId =
//     "RQMC" +
//     d.getFullYear() +
//     d.getMonth() +
//     d.getDate() +
//     "-" +
//     (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
//   let insertData = { requestId, issuer, issueNoticed, imgUrl, location };
//   insertData = { ...insertData, issuerEmail, locationName, carDescription };
//   status && (insertData.status = status);
//   comments && (insertData.comments = comments);
//   insertData.creator = req.user.id;
//   try {
//     let request = new ReportSOS(insertData);
//     await request.save();
//     res.status(201).send({ success: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  //let { issuer, issuerEmail, carDescription, issueNoticed } = req.body;
  let { status, comments } = req.body;
  //   if (!issuer && !subject) {
  //     return res.status(400).json({ msg: "Invalid request" });
  //   }
  let requestData = await ReportSOS.findById(req.params.id);
  if (!requestData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  const d = new Date();
  let sosId =
    "RQMC" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let updateFields = {};
  requestData.sosId == undefined && (updateFields.sosId = sosId);
  // issuer && (updateFields.issuer = issuer);
  // issuerEmail && (updateFields.issuerEmail = issuerEmail);
  // issueNoticed && (updateFields.issueNoticed = issueNoticed);
  status && (updateFields.status = status);
  comments && (updateFields.comments = comments);
  try {
    request = await ReportSOS.findOneAndUpdate(
      { _id: req.params.id },
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
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
