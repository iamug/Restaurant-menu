const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Itinerary = require("../../models/Itinerary");
const Vehicle = require("../../models/Vehicle");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Module = "Itinerary";
//const { query } = require("express");

// @route   GET api/itinerary/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.find()
      .sort({
        createdAt: -1,
      })
      .lean();
    if (!itinerary) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(itinerary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/itinerary/:id
// @desc    Get current users profile
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    console.log("itin id", req.params.id);
    const itinerary = await Itinerary.findById(req.params.id).lean();
    if (!itinerary)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    if (itinerary.length == 0)
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    res.json(itinerary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/booking/
// @desc    Get current users profile
// @access  Private
router.get("/assignedvehicle/:userId", async (req, res) => {
  const date = new Date();
  if (req.params.userId !== undefined) {
    q = {
      createdBy: req.params.userId,
      itineraryOption: "self-driven",
      updatedAt: { $exists: true },
      dropoffDate: {
        $gte: new Date(new Date()),
      },
      assignedVehicle: { $exists: true },
    };
  } else {
    return res.status(400).json({ msg: "Invalid request" });
  }
  try {
    const bookings = await Itinerary.findOne(q)
      .select("assignedVehicle")
      .sort({ updatedAt: -1 })
      .lean();
    if (!bookings) {
      res.status(404).send({ success: false, msg: "Record does not exist" });
    }
    const vehicle = await Vehicle.findById(bookings.assignedVehicle)
      .select("carId vin plateNo car carColor carImage")
      .lean();
    if (!vehicle) {
      res.status(404).send({ success: false, msg: "Record does not exist" });
    }
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  DELETE api/plans/:id
// @desc   Delete plans route
// @access Private
// @Params  id -- id of plan
router.delete("/:id", auth, async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let itinerary = await Itinerary.findByIdAndRemove(req.params.id);
    if (!itinerary) {
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
  let { assignedVehicle } = req.body;
  let itineraryData = await Itinerary.findById(req.params.id);
  if (!itineraryData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  if (
    assignedVehicle === undefined ||
    (itineraryData.assignedVehicle !== undefined &&
      itineraryData.assignedVehicle == assignedVehicle)
  ) {
    return res.json({ success: true });
  }
  assignedVehicle && (updateFields.assignedVehicle = assignedVehicle);
  if (!updateFields.assignedVehicle) return res.json({ success: true });
  try {
    let itinerary = await Itinerary.findOneAndUpdate(
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
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
