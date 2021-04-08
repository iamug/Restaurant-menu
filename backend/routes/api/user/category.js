const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Category = require("../../../models/Category");
const { generateId, validMongooseId } = require("../../../utils/utils");
//const { query } = require("express");

// @route   GET api/payment/
// @desc    Get current users profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const category = await Category.find({ isEnabled: true })
      .sort({ createdAt: -1 })
      .lean();
    if (!category) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
