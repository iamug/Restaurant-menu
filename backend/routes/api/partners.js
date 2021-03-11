const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const auth = require("../../middleware/auth");

const Partner = require("../../models/Partner");
const Module = "Partners";

// @route   GET api/partners/
// @desc    Get all partners
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const partners = await Partner.find()
      .select("-password -date_created -creator -updatedAt -createdAt")
      .sort({ date_created: -1 });
    if (!partners) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    //console.log(req.method);
    // Logger(
    //   req,
    //   Module || "Partners",
    //   req.method || "Fetch",
    //   "all",
    //   "Admin fetched all partners"
    // );
    res.json({ success: true, partners });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/users
// @desc   Register route
// @access Public
router.post(
  "/",
  auth,
  [check("carname", "Name is required").not().isEmpty()],
  async (req, res) => {
    console.log(req.body);
    console.log(req.user);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      car,
      carname,
      inspection_date,
      inspection_time,
      vehicleColor,
      license_plate,
      car_description,
      vehiclePhoto,
      vehiclePhoto2,
      partner,
    } = req.body;

    const {
      car_name,
      model_id,
      model_make_id,
      model_name,
      model_trim,
      model_year,
    } = car;
    const { email } = partner;

    console.log(model_id);
    console.log(email);

    try {
      //let user = await Partner.findOne({ email });

      let vehicle = new Vehicle({
        car,
        manufacturer: model_make_id,
        carModel: model_name,
        carYear: model_year,
        vehicleColor: vehicleColor,
        plateNo: license_plate,
        inspectionDate: inspection_date,
        inspectionTime: inspection_time,
        carDescription: car_description,
        imagePath: vehiclePhoto,
        images: vehiclePhoto2,
        creator: req.user.id,
      });

      await vehicle.save();

      const payload = {
        vehicle: {
          id: vehicle.id,
        },
      };

      console.log("Vehicle registered");
      res.status(200).send("Success");
      //res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
