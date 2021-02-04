const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    console.log(req);
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""),
      });
      if (!user) {
        return res.status(400).json({ message: "Unauthorized" });
      } else {
        req.user = user;
        return next();
      }
    } else {
      return res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = isAuthenticated;