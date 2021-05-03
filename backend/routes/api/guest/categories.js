const express = require("express");
const router = express.Router();
const Category = require("../../../models/Category");
const { generateId, validMongooseId } = require("../../../utils/utils");

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isEnabled: true })
      .select("name _id")
      .sort({ updateddAt: -1 })
      .lean();
    if (!categories) {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.json({ success: true, categories });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
