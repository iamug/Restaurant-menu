const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Land = require("../../models/Lands");
// const Vehicle = require("../../models/Vehicle");
// const Partner = require("../../models/Partner");
// const Retrieval = require("../../models/Retrievals");

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const land = await Land.find().sort({ date_created: -1 });
    if (!land) {
      return res.status(400).json({ msg: "There is no land" });
    }
    res.json(land);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/earnings/delete
// @desc   Earnings route
// @access Private
router.post("/delete", auth, async (req, res) => {
  console.log(req.body.id);
  if (!req.body.id) {
    return res.status(400).json({ errors: [{ msg: "invalid Request" }] });
  }
  try {
    let land = await Land.findById(req.body.id);
    if (!land) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Record does not exist" }] });
    }
    await land.remove();
    res.status(200).send({ deleted: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.post("/", auth, async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  //const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }*/
  //res.status(200).send("Success");

  const {
    name,
    estate,
    location,
    address,
    availableQty,
    details,
    email,
    imagePath,
    status,
    amount,
  } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Kindly enter a name for this land" });
  }

  try {
    let land = new Land({
      name,
      estate,
      location,
      address,
      availableQty,
      details,
      amount: parseFloat(amount),
      creator: req.user.id,
      creatorEmail: email,
      imagePath,
      status,
    });

    await land.save();

    const payload = {
      land: {
        id: land.id,
      },
    };

    console.log("Land registered");
    res.status(200).send(land);
    //res.send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/", auth, async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  //const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }*/
  //res.status(200).send("Success");
  if (!req.body.id) {
    return res.status(400).json({ msg: "Kindly enter a id for this land" });
  }
  const {
    name,
    estate,
    location,
    address,
    availableQty,
    details,
    email,
    imagePath,
    status,
    amount,
  } = req.body;

  const ProfileFields = {
    name,
    estate,
    location,
    address,
    availableQty,
    details,
    amount: parseFloat(amount),
    creator: req.user.id,
    creatorEmail: email,
    imagePath,
    status,
  };

  try {
    let land = await Land.findOne({ _id: req.body.id });
    //console.log(partner);
    if (land) {
      land = await Land.findOneAndUpdate(
        { _id: req.body.id },
        { $set: ProfileFields },
        { new: true }
      );
      return res.json(land);
    } else {
      res.status(404).send("Land not found");
    }
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
