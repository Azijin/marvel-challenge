const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

const isEmailRegistered = require("../middlewares/isEmailRegistered");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/signup", isEmailRegistered, async (req, res) => {
  try {
    const { username, email, password } = req.fields;
    console.log(username, email, password);
    const isUsername = await User.findOne({
      "account.username": username.toLowerCase(),
    });
    if (isUsername) {
      res.status(409).json({ message: "Sorry, this username is already used" });
    } else {
      const checkPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
      );
      if (!checkPassword.test(password)) {
        res.status(409).json({
          message:
            "your password must contain a letter in upper and lower case, a number, a special character and must be 8 characters minimum",
        });
      } else {
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(64);
        const user = new User({
          salt: salt,
          hash: hash,
          token: token,
          account: {
            username: username.toLowerCase(),
            email: email.toLowerCase(),
          },
        });
        const newUser = await user.save();
        if (!newUser) {
          res.status(500).json({
            message:
              "The server encountered an unexpected condition that prevented it from fulfilling the request.",
          });
        } else {
          console.log(newUser);
          res.status(200).json({
            message: `Your account has been created.Thank you for signing up ${username}`,
            token: newUser.token,
            id: newUser._id,
            account: newUser.account,
          });
        }
      }
    }
    res.status(200).json({ message: "signup" });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accountId, password } = req.fields;
    if (!accountId) {
      res.status(400).json({ message: "Missing username or email to login" });
    } else {
      if (!password) {
        res.status(400).json({ message: "Missing password to login" });
      } else {
        const checkAccountId = /@/g;
        const searchKey = checkAccountId.test(accountId)
          ? { "account.email": accountId }
          : { "account.username": accountId };
        const user = await User.findOne(searchKey);
        if (!user) {
          res
            .status(400)
            .json({ message: "No account found with this username or email" });
        } else {
          const checkPassword = SHA256(password + user.salt).toString(
            encBase64
          );
          if (checkPassword !== user.hash) {
            res
              .status(400)
              .json({ message: " Username/email or password are incorrect" });
          } else {
            res.status(200).json({
              message: `Welcome back ${user.account.username}`,
              token: user.token,
              account: user.account,
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/setting/profil",
  isAuthenticated,
  isEmailRegistered,
  async (req, res) => {
    try {
      const user = req.user;
      const updateAccount = {};

      const keys = Object.keys(user.account);
      keys.forEach((key) => {
        if (req.fields[key]) {
          updateAccount[key] = req.fields[key];
        } else {
          updateAccount[key] = user.account[key];
        }
      });

      const userUpdated = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { account: updateAccount } },
        {
          new: true,
          omitUndefined: true,
          useFindAndModify: false,
        }
      );

      await userUpdated.save();

      res.status(200).json({
        message: "Your profil has successfully been updated",
        newProfil: userUpdated.account,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
module.exports = router;
