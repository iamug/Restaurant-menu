// const express = require("express");
// const router = express.Router();
// const config = require("config");
// const { check, validationResult } = require("express-validator");
// const auth = require("../../middleware/auth");
// const Payment = require("../../models/Payments");
// //const { query } = require("express");

// // @route   GET api/payment/
// // @desc    Get current users profile
// // @access  Private
// router.get("/", auth, async (req, res) => {
//   try {
//     const payments = await Payment.find()
//       .sort({
//         date_created: -1,
//       })
//       .lean();
//     if (!payments) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json({ success: true, payments });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/payment/:id
// // @desc    Get current users profile
// // @access  Private
// router.get("/:id", async (req, res) => {
//   try {
//     const payment = await Payment.find({
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

// // @route  DELETE api/plans/:id
// // @desc   Delete plans route
// // @access Private
// // @Params  id -- id of plan
// router.delete("/:id", auth, async (req, res) => {
//   if (!req.params.id) {
//     return res.status(400).json({ success: false, msg: "invalid Request" });
//   }
//   try {
//     let payment = await Payment.findOneAndRemove({
//       paymentId: req.params.id,
//     });
//     if (!payment) {
//       return res
//         .status(404)
//         .json({ success: false, msg: "Record does not exist" });
//     }
//     res.status(200).send({ success: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route  POST api/plans
// // @desc   Add Plans route
// // @access Public
// router.post("/", auth, async (req, res) => {
//   let { status, userId, bookingId, quotationId, reference, amount } = req.body;
//   if (!amount && !bookingId && !userId && !quotationId && !reference) {
//     return res.status(400).json({ success: false, msg: "Invalid request" });
//   }
//   const d = new Date();
//   let paymentId =
//     "CMPYT" +
//     d.getFullYear() +
//     d.getMonth() +
//     d.getDate() +
//     "-" +
//     (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
//   let insertData = { userId, bookingId, quotationId, reference, amount };
//   insertData.creator = req.user.id;
//   insertData.paymentId = paymentId;
//   status && (insertData.status = status);
//   try {
//     let payment = new Payment(insertData);
//     payment = await payment.save();
//     res.status(201).send({ success: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route  POST api/retrievals/me
// // @desc   Retrieval route
// // @access Private
// router.put("/:id", auth, async (req, res) => {
//   if (!req.params.id) {
//     return res.status(400).json({ success: false, msg: "Invalid request" });
//   }
//   let { status, userId, bookingId, quotationId, reference, amount } = req.body;
//   let paymentData = await Payment.findOne({ paymentId: req.params.id });
//   if (!paymentData)
//     res.status(404).send({ success: false, msg: "Record does not exist" });
//   let updateFields = {};
//   status && (updateFields.status = status);
//   userId && (updateFields.userId = userId);
//   bookingId && (updateFields.bookingId = bookingId);
//   quotationId && (updateFields.quotationId = quotationId);
//   reference && (updateFields.reference = reference);
//   amount && (updateFields.amount = amount);
//   try {
//     let payment = await Payment.findOneAndUpdate(
//       { paymentId: req.params.id },
//       { $set: updateFields },
//       { new: true }
//     );
//     return res.json({ success: true });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;
