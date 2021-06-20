const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Table = require("../../../models/Tables");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const tables = await Table.find({ creator: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    if (!tables) return res.status(400).json({ msg: "Invalid request" });
    res.json({ success: true, tables });
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
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let table = await Table.findOneAndRemove({
      _id: req.params.id,
      creator: req.user.id,
    });
    if (!table) {
      return res
        .status(404)
        .json({ success: false, msg: "Record does not exist" });
    }
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", auth, async (req, res) => {
  let { tableName, slug, isEnabled, tableCategory } = req.body;
  if (!tableName || !slug) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let tableId = generateId(`TABLE-${slug}`);
  let insertData = { tableId, tableName };
  insertData.creator = req.user.id;
  isEnabled && (insertData.isEnabled = isEnabled);
  tableCategory && (insertData.tableCategory = tableCategory);
  try {
    let table = await new Table(insertData).save();
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
  if (!req.params.id || !validMongooseId(req.params.id)) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  let { name, isEnabled, tableCategory } = req.body;
  let tableData = await Table.findById(req.params.id);
  if (!tableData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  name && (updateFields.name = name);
  tableCategory && (updateFields.tableCategory = tableCategory);
  isEnabled !== undefined && (updateFields.isEnabled = isEnabled);
  try {
    let table = await Table.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
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
