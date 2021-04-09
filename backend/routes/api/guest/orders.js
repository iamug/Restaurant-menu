// const express = require("express");
// const router = express.Router();
// const config = require("config");
// const { check, validationResult } = require("express-validator");
// const auth = require("../../middleware/auth");

// const Orders = require("../../models/Orders");
// const Partner = require("../../models/Users");

// // @route   GET api/orders/me
// // @desc    Get current users orderss
// // @access  Private
// router.get("/", auth, async (req, res) => {
//   console.log(req.user.id);
//   try {
//     const orders = await Orders.find().sort({ date_created: -1 });
//     if (!orders) {
//       console.log("empty");
//       return res.status(400).json({ msg: "There is no orders for this user" });
//     }
//     res.json(orders);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route  POST api/earnings/delete
// // @desc   Earnings route
// // @access Private
// router.post("/delete", auth, async (req, res) => {
//   console.log(req.body.id);
//   if (!req.body.id) {
//     return res.status(400).json({ errors: [{ msg: "invalid Request" }] });
//   }
//   try {
//     let order = await Orders.findById(req.body.id);
//     if (!order) {
//       return res
//         .status(404)
//         .json({ errors: [{ msg: "Record does not exist" }] });
//     }
//     await order.remove();
//     res.status(200).send({ deleted: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route  POST api/retrievals/me
// // @desc   Retrieval route
// // @access Private
// router.put("/", auth, async (req, res) => {
//   if (!req.body.id) {
//     return res.status(400).json({ msg: "Invalid request" });
//   }
//   const { paymentStatus, paymentOption, date_created } = req.body;

//   console.log(req.body.id);

//   const ProfileFields = {
//     paymentStatus,
//     paymentOption,
//     date_created,
//   };

//   try {
//     let order = await Orders.findOne({ _id: req.body.id });
//     //console.log(partner);
//     if (order) {
//       order = await Orders.findOneAndUpdate(
//         { _id: req.body.id },
//         { $set: ProfileFields },
//         { new: true }
//       );
//       return res.status(200).send({ updated: true });
//     } else {
//       res.status(404).send("Payment not found");
//     }
//   } catch (err) {
//     console.log(error);
//     res.status(500).send("Server error");
//   }
// });

// // @route  POST api/orders/me
// // @desc   Orders route
// // @access Private
// router.post("/me", auth, async (req, res) => {
//   console.log(req.body);
//   console.log(req.user.id);

//   let {
//     name,
//     email,
//     phone,
//     paymentOption,
//     propertyLocation,
//     product,
//     estate,
//     invAmount,
//     upline,
//   } = req.body;

//   if (
//     !invAmount &&
//     !product &&
//     !paymentOption &&
//     !upline &&
//     !email &&
//     !name &&
//     !propertyLocation
//   ) {
//     return res.status(400).json({ errors: [{ msg: "Invalid request" }] });
//   }
//   const d = new Date();
//   let orderId =
//     "" +
//     d.getFullYear() +
//     d.getMonth() +
//     d.getDate() +
//     "-" +
//     (d.getHours() + d.getMinutes() + Math.floor(Math.random() * 9999));
//   console.log(orderId);
//   let userupline = {};
//   userupline.l1 = upline.l1 ? (upline.l1 ? upline.l1 : undefined) : undefined;
//   userupline.l2 = upline.l2 ? (upline.l2 ? upline.l2 : undefined) : undefined;
//   userupline.l3 = upline.l3 ? (upline.l3 ? upline.l3 : undefined) : undefined;
//   userupline.l4 = upline.l4 ? (upline.l4 ? upline.l4 : undefined) : undefined;

//   console.log(userupline);

//   if (invAmount) {
//     let commission = {};
//     if (upline) {
//       upline.l1
//         ? (commission.l1commission = (10 / 100) * parseInt(invAmount))
//         : undefined;
//       upline.l2
//         ? (commission.l2commission = (5 / 100) * parseInt(invAmount))
//         : undefined;
//       upline.l3
//         ? (commission.l3commission = (3 / 100) * parseInt(invAmount))
//         : undefined;
//       upline.l4
//         ? (commission.l4commission = (2 / 100) * parseInt(invAmount))
//         : undefined;
//     }
//     // l1commission = (10 / 100) * parseInt(invAmount);
//     // l2commission = (5 / 100) * parseInt(invAmount);
//     // l3commission = (3 / 100) * parseInt(invAmount);
//     // l4commission = (2 / 100) * parseInt(invAmount);
//     // let commission = { l1commission, l2commission, l3commission, l4commission };
//     console.log(commission);
//     try {
//       let orders = new Orders({
//         orderId,
//         user: req.user.id,
//         userName: name,
//         userEmail: email,
//         userPhone: phone,
//         product: "GRAP Investment",
//         invAmount,
//         orderAmount: invAmount,
//         commission,
//         upline: userupline,
//       });
//       await orders.save();
//       const payload = {
//         orders: {
//           id: orders.id,
//         },
//       };
//       console.log("Orders registered");
//       return res.status(200).send(orders);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }

//   if (estate) {
//     try {
//       let orders = new Orders({
//         orderId,
//         user: req.user.id,
//         userName: name,
//         userEmail: email,
//         userPhone: phone,
//         product: estate,
//         upline: userupline,
//       });
//       await orders.save();
//       const payload = {
//         orders: {
//           id: orders.id,
//         },
//       };
//       console.log("Orders registered");
//       return res.status(200).send(orders);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }

//   if (propertyLocation) {
//     let commission = {};
//     if (upline) {
//       upline.l1
//         ? (commission.l1commission =
//             (10 / 100) * parseInt(propertyLocation.amount))
//         : undefined;
//       upline.l2
//         ? (commission.l2commission =
//             (5 / 100) * parseInt(propertyLocation.amount))
//         : undefined;
//       upline.l3
//         ? (commission.l3commission =
//             (3 / 100) * parseInt(propertyLocation.amount))
//         : undefined;
//       upline.l4
//         ? (commission.l4commission =
//             (2 / 100) * parseInt(propertyLocation.amount))
//         : undefined;
//     }
//     // let l1commission = 0.1 * parseInt(propertyLocation.amount);
//     // let l2commission = (5 / 100) * parseInt(propertyLocation.amount);
//     // let l3commission = (3 / 100) * parseInt(propertyLocation.amount);
//     // let l4commission = (2 / 100) * parseInt(propertyLocation.amount);
//     // let commission = { l1commission, l2commission, l3commission, l4commission };
//     console.log(commission);

//     try {
//       let orders = new Orders({
//         orderId,
//         user: req.user.id,
//         userName: name,
//         userEmail: email,
//         userPhone: phone,
//         product: "Mite Plan",
//         paymentOption,
//         propertyLocation,
//         orderAmount: propertyLocation.amount,
//         commission,
//         upline: userupline,
//       });
//       await orders.save();
//       const payload = {
//         orders: {
//           id: orders.id,
//         },
//       };
//       console.log("Orders registered");
//       return res.status(200).send(orders);
//       //res.status(200).send(orders);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }

//   //let paymentDateISO = moment(paymentDate).format("YYYY-MM-DD[T00:00:00.000Z]");
//   //let paymentDateISO2 = new Date(paymentDate).toISOString();

//   //   try {
//   //     let vehicle = await Vehicle.findOne({ plateNo: vehiclePlateNo });
//   //     let partner = await Partner.findOne({ email: partnerEmail });
//   //     console.log(vehicle);
//   //     console.log(partner);
//   //     const { bankAccount, bankAccountNumber, bankAccountName } = partner;
//   //     let partnerBankAccount = {
//   //       bankAccount,
//   //       bankAccountNumber,
//   //       bankAccountName,
//   //     };
//   //     console.log(partnerBankAccount);

//   //     let orders = new Orders({
//   //       paymentStatus,
//   //       paymentDate: paymentDateISO2,
//   //       paymentAmount,
//   //       paymentReference,
//   //       partner: partner._id,
//   //       partnerID,
//   //       partnerEmail,
//   //       vehicle: vehicle._id,
//   //       vehicleID,
//   //       vehicleName: vehicle.car.car_name,
//   //       vehiclePlateNo,
//   //       partnerBankAccount,
//   //     });

//   //     await orders.save();

//   //     const payload = {
//   //       orders: {
//   //         id: orders.id,
//   //       },
//   //     };

//   //     console.log("Orders registered");
//   //     res.status(200).send(orders);
//   //     //res.send("User registered");
//   //   } catch (err) {
//   //     console.error(err.message);
//   //     res.status(500).send("Server error");
//   //   }
// });

// // @route   GET api/orders/me/total
// // @desc    Get current users total order amount
// // @access  Private
// router.get("/total", auth, async (req, res) => {
//   try {
//     const orders = await Orders.find();
//     console.log(orders.length);
//     if (orders.length == 0) {
//       return res.json({ total: 0, count: orders.length });
//     }
//     let total = null;
//     await Orders.aggregate([
//       { $match: {} },
//       { $group: { _id: null, sum: { $sum: "$orderAmount" } } },
//     ]).then((res) => (total = res[0].sum));

//     res.json({ total: total, count: orders.length });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// module.exports = router;
