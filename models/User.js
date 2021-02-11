const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    username: {
      unique: true,
      type: String,
    },
    firstName: String,
    lastName: String,
    email: {
      unique: true,
      type: String,
    },
    phone: String,
    avatar: { type: mongoose.Schema.Types.Mixed, default: {} },
    city: String,
    country: String,
    adress: String,
    postalCode: Number,
    favorites: {
      comics: Array,
      characters: Array,
    },
  },
  token: String,
  hash: String,
  salt: String,
});
module.exports = User;
