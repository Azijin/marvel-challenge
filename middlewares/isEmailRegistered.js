const User = require("../models/User");

const isEmailRegistered = async (req, res, next) => {
  try {
    if (!req.fields.email) {
      return next();
    } else {
      const checkEmail = await User.findOne({
        "account.email": req.fields.email,
      });
      if (checkEmail) {
        return res
          .status(409)
          .json({ message: "There already an account with this email" });
      } else {
        return next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = isEmailRegistered;
