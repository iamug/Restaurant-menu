const express = require("express");
const router = express.Router();
const User = require("../../../models/Users");
const Order = require("../../../models/Orders");
const Table = require("../../../models/Tables");
const { generateId } = require("../../../utils/utils");

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", async (req, res) => {
  let { tableName, products, user, slug } = req.body;
  if (!tableName || !user || !products || !slug) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  const userdata = await User.findOne({ slug }).select("_id").lean();
  if (!userdata) return res.status(404).json({ msg: "Record does not exist" });
  const table = await Table.findOne({
    creator: userdata._id,
    tableName: tableName,
  })
    .select("tableCategory tableName isEnabled _id")
    .lean();
  if (!table)
    return res
      .status(424)
      .json({ msg: "Table is not valid. Please rescan QRCode" });
  let orderId = generateId(`${slug}-${tableName}`);
  let insertData = { orderId, tableName, products, user };
  try {
    let order = await new Order(insertData).save();
    res.status(201).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
