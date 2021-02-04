const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set("debug", true);

const app = express();
app.use(formidable());
app.use(cors());

const userRoutes = require("./routes/user");
const comicsRoutes = require("./routes/comics");
const charactersRouters = require("./routes/characters");

app.use(userRoutes);
app.use(comicsRoutes);
app.use(charactersRouters);

app.all("*", (req, res) => {
  res.status(404).json({ message: "No page found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server is started, let's go !");
});
