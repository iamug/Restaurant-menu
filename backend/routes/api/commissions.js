const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const https = require("https");
const axios = require("axios");

const Orders = require("../../models/Orders");
const Partner = require("../../models/Users");

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.post("/me/all", async (req, res) => {
  //console.log(req.userToken);
  console.log(req.body.refcode);

  const l1orders = await Orders.find({
    "upline.l1": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l1 commission.l1commission -_id"
    )
    .lean();

  if (!l1orders) {
    console.log("empty");
    return res.status(404).json({ msg: "There is no orders for this user" });
  }
  l1orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l1commission);
    }
    //l3 = [...l3, item];
  });

  const l2orders = await Orders.find({
    "upline.l2": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l2 commission.l2commission -_id"
    )
    .lean();
  l2orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l2commission);
    }
  });

  const l3orders = await Orders.find({
    "upline.l3": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l3 commission.l3commission -_id"
    )
    .lean();
  l3orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l3commission);
    }
  });
  const l4orders = await Orders.find({
    "upline.l4": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l4 commission.l4commission -_id"
    )
    .lean();
  l4orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l4commission);
    }
  });

  console.log(l4orders.length);

  res.json({ l1orders, l2orders, l3orders, l4orders });

  //console.error(err.message);
  //res.status(500).send("Server Error");
});

// @route   GET api/orders/me
// @desc    Get current users orderss
// @access  Private
router.post("/me/all/total", async (req, res) => {
  //console.log(req.userToken);
  console.log(req.body.refcode);
  let total = 0;
  const l1orders = await Orders.find({
    "upline.l1": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l1 commission.l1commission -_id"
    )
    .lean();

  if (!l1orders) {
    console.log("empty");
    return res
      .status(200)
      .json({ errors: [{ msg: "There is no orders for this user" }] });
  }
  l1orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l1commission);
      total += item.commission.l1commission;
    }
    //l3 = [...l3, item];
  });

  const l2orders = await Orders.find({
    "upline.l2": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l2 commission.l2commission -_id"
    )
    .lean();
  l2orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l2commission);
      total += item.commission.l2commission;
    }
  });

  const l3orders = await Orders.find({
    "upline.l3": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l3 commission.l3commission -_id"
    )
    .lean();
  l3orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l3commission);
      total += item.commission.l3commission;
    }
  });
  const l4orders = await Orders.find({
    "upline.l4": req.body.refcode,
  })
    .select(
      "product userName userEmail orderAmount upline.l4 commission.l4commission -_id"
    )
    .lean();
  l4orders.forEach(function (item) {
    if (item.commission) {
      console.log(item.commission.l4commission);
      total += item.commission.l4commission;
    }
  });

  console.log("total");
  console.log(total);

  res.json({ total });

  //console.error(err.message);
  //res.status(500).send("Server Error");
});

/* ignore */

router.post("/ref/up/all", async (req, res) => {
  console.log(req.body.refcode);
  let l1 = await User.findOne({ refcode: req.body.refcode })
    .select("referrer -_id")
    .lean();
  console.log(l1);
  l1 ? (l1 = l1.referrer) : null;

  if (!l1) {
    return res
      .status(200)
      .json({ errors: [{ msg: "There is no user with that referral code" }] });
  }

  //let l2 = {};
  let l2user, l3user, l4user, l2, l3, l4;
  if (l4) {
    console.log("works");
  }
  console.log("l1.refcode");
  console.log(l1.referrer);
  l2user = await User.findOne({ refcode: l1 }).select("referrer -_id").lean();
  if (l2user) {
    l2 = l2user.referrer;
    console.log("l2user");
    console.log(l2);
  }
  // l2.push(users);
  console.log(l2);
  //let l3 = {};
  console.log("level 3");
  //console.log(item2);
  //console.log(l2.referrer);
  if (l2 != undefined) {
    let l3user = await User.findOne({ refcode: l2 })
      .select("referrer -_id")
      .lean();
  }
  if (l3user) {
    l3 = l3user.referrer;
  }
  console.log("l3");
  console.log(l3);
  //l3.push(users);
  //let l4 = {};
  if (l3) {
    l4user = await User.findOne({ refcode: l3 }).select("referrer -_id").lean();
  }
  if (l4user) {
    let l4 = l4user.referrer;
  }
  const upline = { l1: l1, l2: l2, l3: l3, l4: l4 };

  return res.status(200).json(upline);
});

//end ignore

// @route  POST api/orders/me
// @desc   Orders route
// @access Private
router.post("/me", auth, async (req, res) => {
  console.log(req.body);
  console.log(req.user.id);

  const {
    name,
    email,
    phone,
    paymentOption,
    propertyLocation,
    product,
    estate,
    invAmount,
    upline,
  } = req.body;

  if (
    !invAmount &&
    !product &&
    !paymentOption &&
    !upline &&
    !email &&
    !name &&
    !propertyLocation
  ) {
    return res.status(400).json({ errors: [{ msg: "Invalid request" }] });
  }
  const userupline = {
    l1: upline.l1.referrer,
    l2: upline.l2.referrer,
    l3: upline.l3.referrer,
    l4: upline.l4.referrer,
  };

  if (invAmount) {
    l1commission = (10 / 100) * parseInt(invAmount);
    l2commission = (5 / 100) * parseInt(invAmount);
    l3commission = (3 / 100) * parseInt(invAmount);
    l4commission = (2 / 100) * parseInt(invAmount);
    let commission = { l1commission, l2commission, l3commission, l4commission };
    try {
      let orders = new Orders({
        user: req.user.id,
        userName: name,
        userEmail: email,
        userPhone: phone,
        product: "GRAP Investment",
        invAmount,
        orderAmount: invAmount,
        commission,
        upline: userupline,
      });
      await orders.save();
      const payload = {
        orders: {
          id: orders.id,
        },
      };
      console.log("Orders registered");
      return res.status(200).send(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  if (estate) {
    try {
      let orders = new Orders({
        user: req.user.id,
        userName: name,
        userEmail: email,
        userPhone: phone,
        product: estate,
        upline: userupline,
      });
      await orders.save();
      const payload = {
        orders: {
          id: orders.id,
        },
      };
      console.log("Orders registered");
      return res.status(200).send(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  if (propertyLocation) {
    let l1commission = 0.1 * parseInt(propertyLocation.amount);
    let l2commission = (5 / 100) * parseInt(propertyLocation.amount);
    let l3commission = (3 / 100) * parseInt(propertyLocation.amount);
    let l4commission = (2 / 100) * parseInt(propertyLocation.amount);
    let commission = { l1commission, l2commission, l3commission, l4commission };
    console.log(commission);

    try {
      let orders = new Orders({
        user: req.user.id,
        userName: name,
        userEmail: email,
        userPhone: phone,
        product: "Mite Plan",
        paymentOption,
        propertyLocation,
        orderAmount: propertyLocation.amount,
        commission,
        upline: userupline,
      });
      await orders.save();
      const payload = {
        orders: {
          id: orders.id,
        },
      };
      console.log("Orders registered");
      return res.status(200).send(orders);
      //res.status(200).send(orders);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  //let paymentDateISO = moment(paymentDate).format("YYYY-MM-DD[T00:00:00.000Z]");
  //let paymentDateISO2 = new Date(paymentDate).toISOString();

  //   try {
  //     let vehicle = await Vehicle.findOne({ plateNo: vehiclePlateNo });
  //     let partner = await Partner.findOne({ email: partnerEmail });
  //     console.log(vehicle);
  //     console.log(partner);
  //     const { bankAccount, bankAccountNumber, bankAccountName } = partner;
  //     let partnerBankAccount = {
  //       bankAccount,
  //       bankAccountNumber,
  //       bankAccountName,
  //     };
  //     console.log(partnerBankAccount);

  //     let orders = new Orders({
  //       paymentStatus,
  //       paymentDate: paymentDateISO2,
  //       paymentAmount,
  //       paymentReference,
  //       partner: partner._id,
  //       partnerID,
  //       partnerEmail,
  //       vehicle: vehicle._id,
  //       vehicleID,
  //       vehicleName: vehicle.car.car_name,
  //       vehiclePlateNo,
  //       partnerBankAccount,
  //     });

  //     await orders.save();

  //     const payload = {
  //       orders: {
  //         id: orders.id,
  //       },
  //     };

  //     console.log("Orders registered");
  //     res.status(200).send(orders);
  //     //res.send("User registered");
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(500).send("Server error");
  //   }
});

// @route   GET api/orders/me/total
// @desc    Get current users total order amount
// @access  Private
router.get("/me/total", auth, async (req, res) => {
  console.log(req.user.id);
  try {
    const orders = await Orders.find({
      user: req.user.id,
    });
    console.log(orders.length);
    if (orders.length == 0) {
      return res.json({ total: 0 });
    }
    let total = null;
    await Orders.aggregate([
      { $match: { userEmail: orders[0].userEmail } },
      { $group: { _id: null, sum: { $sum: "$orderAmount" } } },
    ]).then((res) => (total = res[0].sum));

    res.json({ total: total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
