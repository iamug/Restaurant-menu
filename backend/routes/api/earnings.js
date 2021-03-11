const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Earning = require("../../models/Earnings");
const Vehicle = require("../../models/Vehicle");
const Partner = require("../../models/Partner");
const Admin = require("../../models/Admins");

// @route   GET api/earning/
// @desc    Get current users earnings
// @access  Private
router.get("/", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const earning = await Earning.find().sort({ paymentDate: -1 });

    if (!earning) {
      console.log("empty");
      return res
        .status(400)
        .json({ msg: "There is no earnining for this user" });
    }

    res.json(earning);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/earning/me
// @desc    Get current users earnings
// @access  Private
router.get("/me", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const earning = await Earning.find({
      partner: req.user.id,
    }).sort({ paymentDate: -1 });

    if (!earning) {
      console.log("empty");
      return res
        .status(400)
        .json({ msg: "There is no earnining for this user" });
    }

    res.json(earning);
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
    let earning = await Earning.findById(req.body.id);
    if (!req.body.id) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Record does not exist" }] });
    }
    console.log(earning);
    //await earning.remove();
    console.log("Earning deleted");
    res.status(200).send({ deleted: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/earnings/me
// @desc   Earnings route
// @access Private
router.post("/me", async (req, res) => {
  console.log(req.body);
  //console.log(req.user);
  //const errors = validationResult(req);
  /*if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }*/
  //res.status(200).send("Success");
  const {
    paymentStatus,
    paymentDate,
    paymentAmount,
    paymentReference,
    partnerID,
    partnerEmail,
    vehicleID,
    vehicleName,
    vehiclePlateNo,
  } = req.body;

  //let paymentDateISO = moment(paymentDate).format("YYYY-MM-DD[T00:00:00.000Z]");
  let paymentDateISO2 = new Date(paymentDate).toISOString();

  try {
    let vehicle = await Vehicle.findOne({ plateNo: vehiclePlateNo });
    let partner = await Partner.findOne({ email: partnerEmail });
    console.log(vehicle);
    console.log(partner);
    const { bankAccount, bankAccountNumber, bankAccountName } = partner;
    let partnerBankAccount = {
      bankAccount,
      bankAccountNumber,
      bankAccountName,
    };
    console.log(partnerBankAccount);

    let earning = new Earning({
      paymentStatus,
      paymentDate: paymentDateISO2,
      paymentAmount,
      paymentReference,
      partner: partner._id,
      partnerID,
      partnerEmail,
      vehicle: vehicle._id,
      vehicleID,
      vehicleName: vehicle.car.car_name,
      vehiclePlateNo,
      partnerBankAccount,
    });

    await earning.save();

    const payload = {
      earning: {
        id: earning.id,
      },
    };

    console.log("Earning registered");
    res.status(200).send(earning);
    //res.send("User registered");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/earning/me/total
// @desc    Get current users earnings
// @access  Private
router.get("/me/total", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const earning = await Earning.find({
      partner: req.user.id,
    });
    console.log(earning.length);
    if (earning.length == 0) {
      return res.json({ total: 0 });
    }
    let total = null;
    await Earning.aggregate([
      { $match: { partnerEmail: earning[0].partnerEmail } },
      { $group: { _id: null, sum: { $sum: "$paymentAmount" } } },
    ]).then((res) => (total = res[0].sum));

    res.json({ total: total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/earning/me/total/:vehicle
// @desc    Get current users earnings for vehicle
// @access  Private
router.get("/me/total/:vehicle", auth, async (req, res) => {
  console.log(req.user.id);
  console.log(req.params.vehicle);
  const vehicle = req.params.vehicle;
  try {
    const earning = await Earning.find({
      partner: req.user.id,
      vehicle: vehicle,
    });
    console.log(earning);
    if (!earning) {
      console.log("none");
    }
    console.log(earning);
    if (earning.length == 0) {
      return res.json({ total: 0 });
    }
    let total = null;
    await Earning.aggregate([
      {
        $match: {
          partnerEmail: earning[0].partnerEmail,
          vehiclePlateNo: earning[0].vehiclePlateNo,
        },
      },
      { $group: { _id: null, sum: { $sum: "$paymentAmount" } } },
    ]).then((res) => (total = res[0].sum));

    res.json({ total: total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
