// const express = require("express");
// const router = express.Router();
// const { check, validationResult } = require("express-validator");
// const bcrypt = require("bcryptjs");
// const auth = require("../../middleware/auth");
// const Admin = require("../../models/Admins");

// // @route   GET api/profile/me
// // @desc    Get current users profile
// // @access  Private
// router.get("/me", auth, async (req, res) => {
//   try {
//     const profile = await Admin.findOne({
//       user: req.user.id,
//     }).populate("user", ["name", "avatar"]);
//     if (!profile) {
//       return res.status(400).json({ msg: "There is no profile for this user" });
//     }

//     res.json(profile);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route   POST api/profile/
// // @desc    Create or update user profile
// // @access  Private
// router.post(
//   "/",
//   [auth, [check("email", "email is required").not().isEmpty()]],
//   async (req, res) => {
//     console.log(req.body);
//     console.log(req.user);

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors });
//     }
//     const { name, email, phone, avatar, password } = req.body;
//     const ProfileFields = {};
//     ProfileFields.user = req.user.id;
//     ProfileFields.name = name;
//     ProfileFields.email = email;
//     ProfileFields.phone = phone;
//     ProfileFields.avatar = avatar;

//     if (req.body.address) {
//       ProfileFields.address = req.body.address;
//     }

//     if (req.body.businessName) {
//       ProfileFields.businessName = req.body.businessName;
//     }
//     if (req.body.bankAccount) {
//       ProfileFields.bankAccount = req.body.bankAccount;
//       ProfileFields.bankAccountNumber = req.body.bankAccountNumber;
//       ProfileFields.bankAccountName = req.body.bankAccountName;
//     }

//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);

//       //user.password = await bcrypt.hash(password, salt);

//       ProfileFields.password = await bcrypt.hash(password, salt);
//     }

//     //console.log(req.user);
//     try {
//       let partner = await Admin.findOne({ _id: req.user.id });
//       //console.log(partner);
//       if (partner) {
//         partner = await Admin.findOneAndUpdate(
//           { _id: req.user.id },
//           { $set: ProfileFields },
//           { new: true }
//         );
//         return res.json(partner);
//       } else {
//         res.status(500).send("User not found");
//       }
//     } catch (err) {
//       console.log(error);
//       res.status(500).send("Server error");
//     }
//   }
// );

// module.exports = router;
