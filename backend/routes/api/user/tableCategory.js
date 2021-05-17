const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const TableCategory = require("../../../models/TableCategory");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const category = await TableCategory.find().sort({ createdAt: -1 }).lean();
    if (!category)
      return res.status(400).json({ success: false, msg: "Invalid request" });
    return res.json({ success: true, category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/payment/:id
// @desc    Get current users profile
// @access  Private
// router.get("/:id", async (req, res) => {
//   try {
//     const payment = await TableCategory.find({
//       paymentId: req.params.id,
//     }).lean();
//     if (!payment)
//       return res.status(400).json({ success: false, msg: "Invalid request" });
//     if (payment.length == 0)
//       return res
//         .status(404)
//         .json({ success: false, msg: "Record does not exist" });
//     res.json({ success: true, payment });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route  DELETE api/plans/:id
// @desc   Delete plans route
// @access Private
// @Params  id -- id of plan
router.delete("/:id", auth, async (req, res) => {
  if (!req.params.id || !validMongooseId(req.params.id))
    return res.status(400).json({ success: false, msg: "invalid Request" });
  try {
    let category = await TableCategory.findByIdAndRemove(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", auth, async (req, res) => {
  let { name, description, isEnabled } = req.body;
  if (!name || !description) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let insertData = { name, description };
  insertData.creator = req.user.id;
  isEnabled && (insertData.isEnabled = isEnabled);
  try {
    let category = await new TableCategory(insertData).save();
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
  if (!req.params.id || !validMongooseId(req.params.id))
    return res.status(400).json({ success: false, msg: "invalid Request" });
  let { name, description, isEnabled } = req.body;
  let categoryData = await TableCategory.findById(req.params.id);
  if (!categoryData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  description && (updateFields.description = description);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  try {
    let category = await TableCategory.findOneAndUpdate(
      { _id: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
