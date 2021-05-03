const express = require("express");
const router = express.Router();
const Order = require("../../../models/Orders");
const { generateId } = require("../../../utils/utils");

// @route  POST api/plans
// @desc   Add Plans route
// @access Public
router.post("/", async (req, res) => {
  let { tableName, products, isCompleted, user, slug } = req.body;
  if (!tableName || !user || !products || !slug) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let orderId = generateId(`${slug}-`);
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
