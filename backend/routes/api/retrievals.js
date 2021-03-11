const express = require("express");
const router = express.Router();
const config = require("config");
const moment = require("moment");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Earning = require("../../models/Earnings");
const Vehicle = require("../../models/Vehicle");
const Partner = require("../../models/Partner");
const Retrieval = require("../../models/Retrievals");

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/me", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const retrieval = await Retrieval.find({
      partner: req.user.id
    }).sort({ date_created: -1 });
    console.log(retrieval);
    if (!retrieval) {
      return res
        .status(400)
        .json({ msg: "There is no vahicle retrieval for this user" });
    }

    res.json(retrieval);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.post("/me", auth, async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  //const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }*/
  //res.status(200).send("Success");

  const {
    retrievalDate,
    email,
    name,
    vehicle,
    vehicleName,
    vehiclePlateNo,
    retrievalComments
  } = req.body;

  if (!retrievalDate) {
    return res
      .status(400)
      .json({ msg: "Kindly enter a date to retrieval vehicle" });
  }
  let retrievalDateISO = new Date(retrievalDate).toISOString();

  try {
    //let vehicle = await Vehicle.findOne({ plateNo: vehiclePlateNo });
    //let partner = await Partner.findOne({ email: partnerEmail });
    //console.log(vehicle);
    //console.log(partner);
    //const { bankAccount, bankAccountNumber, bankAccountName } = partner;
    /*let partnerBankAccount = {
      bankAccount,
      bankAccountNumber,
      bankAccountName
    };
    console.log(partnerBankAccount);*/

    let retrieval = new Retrieval({
      retrievalDate: retrievalDateISO,
      partner: req.user.id,
      partnerEmail: email,
      partnerName: name,
      vehicle,
      vehicleName,
      vehiclePlateNo,
      retrievalComments
    });

    await retrieval.save();

    const payload = {
      retrieval: {
        id: retrieval.id
      }
    };

    console.log("Earning registered");
    res.status(200).send(retrieval);
    //res.send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
