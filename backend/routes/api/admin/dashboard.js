// const express = require("express");
// const router = express.Router();
// const auth = require("../../middleware/auth");
// const Driver = require("../../models/Drivers");
// const User = require("../../models/Users");
// const Partner = require("../../models/Partner");
// const Vehicle = require("../../models/Vehicle");
// const Ticket = require("../../models/Tickets");
// const Transaction = require("../../models/Transactions");
// const Booking = require("../../models/Booking");

// // @route   GET api/orders/me/total
// // @desc    Get current drivers total order amount
// // @access  Private
// router.get("/totalsummary", auth, async (req, res) => {
//   try {
//     const drivers = await Driver.find().count();
//     const users = await User.find().count();
//     const partners = await Partner.find().count();
//     const vehicles = await Vehicle.find().count();
//     let total = { drivers, users, partners, vehicles };
//     res.json(total);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/orders/me
// // @desc    Get current users orderss
// // @access  Private
// router.get("/recenttickets", auth, async (req, res) => {
//   try {
//     const tickets = await Ticket.find({ status: "Open" })
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .lean();
//     if (!tickets) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json(tickets);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/orders/me
// // @desc    Get current users orderss
// // @access  Private
// router.get("/recenttrans", auth, async (req, res) => {
//   try {
//     const trans = await Transaction.find()
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .lean();
//     if (!trans) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json(trans);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   GET api/orders/me
// // @desc    Get current users orderss
// // @access  Private
// router.get("/recentbookings", auth, async (req, res) => {
//   try {
//     const bookings = await Booking.find()
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .lean();
//     if (!bookings) {
//       return res.status(400).json({ msg: "Invalid request" });
//     }
//     res.json(bookings);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
