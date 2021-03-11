const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  activityLogger: Logger,
} = require("../../utils/activityLoggerController");
const Faq = require("../../models/Faqs");
const Module = "FAQs";

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ date_created: -1 }).lean();
    if (!faqs) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json(faqs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.get("/user", async (req, res) => {
  try {
    const faqs = await Faq.find({ isEnabled: true })
      .sort({ date_created: -1 })
      .select(" -creator -_id")
      .lean();
    if (!faqs) {
      return res.status(400).json({ msg: "Invalid request" });
    }
    res.json({ success: true, faqs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/earnings/delete
// @desc   Earnings route
// @access Private
router.delete("/:id", auth, async (req, res) => {
  console.log(req.params.id);
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "invalid Request" });
  }
  try {
    let faq = await Faq.findOneAndRemove({ faqId: req.params.id });
    if (!faq) {
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
  let { title, description, isEnabled } = req.body;
  if (!title && !description && isEnabled == undefined) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  const d = new Date();
  let faqId =
    "FAQ" +
    d.getFullYear() +
    d.getMonth() +
    d.getDate() +
    "-" +
    (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
  console.log({ faqId });
  try {
    let faq = new Faq({
      faqId,
      title,
      description,
      isEnabled,
      creator: req.user.id,
    });
    let faqData = await faq.save();
    Logger(
      req,
      Module,
      req.method,
      faqData.id,
      `Admin created a record with id ${faqData.id}`
    );
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
  if (!req.params.id) {
    return res.status(400).json({ success: false, msg: "Invalid request" });
  }
  let { title, description, isEnabled } = req.body;
  if (!title && !description && isEnabled == undefined) {
    return res.status(400).json({ msg: "Invalid request" });
  }
  let faqData = await Faq.findOne({ faqId: req.params.id });

  if (!faqData)
    res.status(404).send({ success: false, msg: "Record does not exist" });
  let updateFields = {};
  updateFields.title = title;
  updateFields.description = description;
  updateFields.isEnabled = isEnabled;

  try {
    faq = await Faq.findOneAndUpdate(
      { faqId: req.params.id },
      { $set: updateFields },
      { new: true }
    );
    Logger(
      req,
      Module,
      req.method,
      req.params.id,
      `Admin updated a record with id ${faq.id}`
    );
    return res.status(200).send({ updated: true });
  } catch (err) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
