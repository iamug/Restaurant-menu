const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const DriveTest = require("../../models/DriveTest");
const Module = "DriveTest";

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const drivetests = await DriveTest.find().sort({ date_created: -1 }).lean();
    if (!drivetests) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(drivetests);
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
    let driveTestData = await DriveTest.findOne({
      driveTestId: req.params.id,
    }).lean();
    if (!driveTestData)
      res.status(404).send({ success: false, msg: "Record does not exist" });
    if (driveTestData && driveTestData.driveTestCertId) {
      let user = driveTestData.createdfor;
      let unsetUser = { userDriveTestId: "" };
      await User.findOneAndUpdate(
        { _id: user },
        { $unset: unsetUser },
        { new: true }
      );
    }
    let drivetest = await DriveTest.findOneAndRemove({
      driveTestId: req.params.id,
    });
    if (!drivetest) {
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
  let { status, testCenter, testCenterAddress, comments } = req.body;
  let { certificateUrl, createdfor, testDate } = req.body;
  if (!testCenter && !testCenterAddress && !testDate && !createdfor) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let driveTestId =
    "CMDRVTST" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  let insertData = { testCenter, testCenterAddress, testDate, createdfor };
  insertData.driveTestId = driveTestId;
  status && (insertData.status = status);
  comments && (insertData.comments = comments);
  certificateUrl && (insertData.certificateUrl = certificateUrl);
  try {
    let drivetest = await new DriveTest(insertData).save();
    Logger(
      req,
      Module,
      req.method,
      drivetest.id,
      `Admin created a record with id ${drivetest.id}`
    );
    res.status(201).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/earnings/delete
// @desc   Earnings route
// @access Private
// router.post("/user", async (req, res) => {
//   let { testCenter, testCenterAddress, createdfor, testDate } = req.body;
//   if (!testCenter && !testCenterAddress && !testDate && !createdfor) {
//     return res.status(400).json({ msg: "Invalid request" });
//   }
//   const d = new Date();
//   let driveTestId =
//     "CMDRVTST" +
//     d.getFullYear() +
//     d.getMonth() +
//     d.getDate() +
//     "-" +
//     (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
//   let insertData = { testCenter, testCenterAddress, testDate, createdfor };
//   insertData.driveTestId = driveTestId;
//   try {
//     let driveTest = new DriveTest(insertData);
//     await driveTest.save();
//     res.status(201).send({ success: true, driveTest });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/:id", auth, async (req, res) => {
  let { status, testCenter, testCenterAddress, comments } = req.body;
  let { certificateUrl, createdfor, testDate } = req.body;
  let driveTestCertId,
    userUpdate,
    unsetUpdate = {};
  const d = new Date();
  if (!testCenter && !testCenterAddress && !testDate && !createdfor) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let driveTestData = await DriveTest.findOne({
    driveTestId: req.params.id,
  }).lean();
  if (!driveTestData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  if (status && status == "Passed" && !driveTestData.driveTestCertId) {
    driveTestCertId =
      "USRCRT" +
      d.getFullYear() +
      d.getMonth() +
      d.getDate() +
      "-" +
      (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  }
  let userData = await User.findById(createdfor);
  if (!userData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = { testCenter, testCenterAddress, testDate, createdfor };
  status && (updateFields.status = status);
  comments && (updateFields.comments = comments);
  certificateUrl
    ? (updateFields.certificateUrl = certificateUrl)
    : (unsetUpdate.certificateUrl = "");
  if (status && status == "Passed" && !driveTestData.driveTestCertId) {
    updateFields.driveTestCertId = driveTestCertId;
    userUpdate = { userDriveTestId: driveTestCertId };
  }
  try {
    let driveTest = await DriveTest.findOneAndUpdate(
      { driveTestId: req.params.id },
      { $set: updateFields, $unset: unsetUpdate },
      { new: true }
    );
    if (status && status == "Passed" && !driveTestData.driveTestCertId) {
      await User.findOneAndUpdate(
        { _id: createdfor },
        { $set: userUpdate },
        { new: true }
      );
    }
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${driveTest.id}`
    );
    return res.status(200).send({ updated: true, driveTest });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route  POST api/retrievals/me
// @desc   Retrieval route
// @access Private
router.put("/cancel/:id", auth, async (req, res) => {
  let { createdfor } = req.body;
  if (createdfor == undefined) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let driveTestData = await DriveTest.findOne({
    driveTestId: req.params.id,
  }).lean();
  if (!driveTestData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let userData = await User.findById(createdfor).lean();
  if (!userData)
    res.status(404).send({ success: false, msg: "User does not exist" });
  let unsetUpdate = { certificateUrl: "", driveTestCertId: "" };
  let unsetUser = { userDriveTestId: "" };
  let updateFields = { createdfor, status: "Pending" };
  try {
    let driveTest = await DriveTest.findOneAndUpdate(
      { driveTestId: req.params.id },
      { $set: updateFields, $unset: unsetUpdate },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id: createdfor },
      { $unset: unsetUser },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin cancelled a record with id ${driveTest.id}`
    );
    return res.status(200).send({ updated: true, driveTest });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
