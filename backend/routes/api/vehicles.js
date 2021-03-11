const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Vehicle = require("../../models/Vehicle");
const { query } = require("express");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/", async (req, res) => {
  //console.log(req.user.id);
  console.log(req.query);
  q = {};
  if (req.query.cat) {
    q = { classCategory: { $in: req.query.cat } };
  }
  let cat = req.query.cat || null;
  try {
    const vehicle = await Vehicle.find(q)
      .select("-date_created -creator -updatedAt -createdAt")
      .sort({
        date_created: -1,
      })
      .lean();
    if (!vehicle) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/vehicle/
// @desc    Get current users profile
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.find({ carId: req.params.id })
      .select("-date_created -creator -updatedAt -createdAt -_id")
      .lean();
    console.log(vehicle.length);
    if (!vehicle)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    if (vehicle.length == 0)
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    res.json({ success: true, vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/vehicles
// @desc   Add Vehicles route
// @access Public
router.post("/", auth, async (req, res) => {
  let { car, carColor, plateNo, vin, classCategory } = req.body;
  if (!car && !carColor && !plateNo && !vin && !classCategory) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  if (
    car.name == undefined &&
    car.modelName == undefined &&
    car.modelTrim == undefined &&
    car.modelYear == undefined
  ) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const d = new Date();
  let carId =
    "CMCAR" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  try {
    let vehicle = new Vehicle({
      carId,
      car,
      carColor,
      plateNo,
      vin,
      classCategory,
      creator: req.user.id,
    });
    await vehicle.save();
    console.log("Vehicle registered");
    res.status(201).send({ success: true, vehicle });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  DELETE api/vehicles/:id
// @desc   Delete vehicles route
// @access Private
// @Params  id -- id of vehicle
router.delete("/:id", auth, async (req, res) => {
  console.log(req.params.id);
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let vehicle = await Vehicle.findOneAndRemove({ carId: req.params.id });
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    console.log({ vehicle });
    //await vehicle.remove();
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
  if (req.body.car) {
    if (
      req.body.name == undefined &&
      req.body.modelName == undefined &&
      req.body.modelTrim == undefined &&
      req.body.modelYear == undefined
    ) {
      return res.status(400).json({ success: false, msg: "Invalid request" });
    }
  }
  let carData = await Vehicle.findOne({ carId: req.params.id });
  if (!carData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  updateFields.car = req.body.car || carData.car;
  updateFields.isBooked = req.body.isBooked || carData.isBooked;
  updateFields.isVerified = req.body.isVerified || carData.isVerified;
  updateFields.carStatus = req.body.carStatus || carData.carStatus;
  updateFields.carColor = req.body.carColor || carData.carColor;
  updateFields.plateNo = req.body.plateNo || carData.plateNo;
  updateFields.vin = req.body.vin || carData.vin;
  req.body.inspectionDate &&
    (updateFields.inspectionDate = req.body.inspectionDate);
  req.body.inspectionTime &&
    (updateFields.inspectionTime = req.body.inspectionTime);
  req.body.inspectionStatus &&
    (updateFields.inspectionStatus = req.body.inspectionStatus);
  req.body.carImage && (updateFields.carImage = req.body.carImage);
  req.body.classCategory &&
    (updateFields.classCategory = req.body.classCategory);
  req.body.images && (updateFields.images = req.body.images);
  console.log({ updateFields });
  try {
    let vehicle = await Vehicle.findOneAndUpdate(
      { carId: req.params.id },
      { $set: updateFields },
      { new: true }
    )
      .select("-date_created -creator -updatedAt -createdAt -_id")
      .lean();
    return res.json({ success: true, vehicle });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
