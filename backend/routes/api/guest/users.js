const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");

const User = require("../../../models/Users");

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ isVerified: true })
      .select("name slug email phone")
      .sort({ createdAt: -1 })
      .lean();
    if (!users) {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.json({ success: true, users });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/retrievals/me
// @desc    Get current users vehicle retrieval
// @access  Private
router.get("/:slug", async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
      .select("name slug email phone")
      .lean();
    if (!user) {
      return res.status(400).json({ msg: "There is no user" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
