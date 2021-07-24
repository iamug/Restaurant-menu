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
  if (!tableName || !user || !products || !slug)
    return res.status(400).json({ success: false, msg: "Invalid request" });
  let tableQuery = { creator: user, tableName: tableName };
  const table = await Table.findOne(tableQuery)
    .select("limit tableName isEnabled _id")
    .lean();
  if (!table)
    return res
      .status(424)
      .json({ msg: "Table is not valid. Please rescan QRCode" });
  console.log({ tableLimit: table });
  if (typeof table.limit == "number") {
    console.log("inn");
    if (table.limit <= 0)
      return res
        .status(424)
        .json({ msg: "Orders from this table is at capacity." });
    if (table.limit > 0) {
      let orderQuery = { user, tableName };
      let totalOrders = await Order.find(orderQuery).countDocuments();
      console.log({ totalOrders, limit: table.limit });
      if (totalOrders >= table.limit)
        return res
          .status(424)
          .json({ msg: "Orders from this table is at capacity." });
    }
  }
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
