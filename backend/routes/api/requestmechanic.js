const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "RequestRepair";
const RequestMechanic = require("../../models/RequestMechanic");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const requests = await RequestMechanic.find()
      .sort({ createdAt: -1 })
      .lean();
    if (!requests) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(requests);
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
    let request = await RequestMechanic.findByIdAndRemove(req.params.id);
    if (!request) {
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

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let { carDescription, issueNoticed, status, response } = req.body;
  let requestData = await RequestMechanic.findById(req.params.id);
  if (!requestData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  const d = new Date();
  let requestId =
    "RQMC" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let updateFields = {};
  requestData.requestId == undefined && (updateFields.requestId = requestId);
  carDescription && (updateFields.carDescription = carDescription);
  issueNoticed && (updateFields.issueNoticed = issueNoticed);
  status && (updateFields.status = status);
  response && (updateFields.response = response);
  try {
    request = await RequestMechanic.findOneAndUpdate(
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
