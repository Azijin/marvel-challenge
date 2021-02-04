const express = require("express");
const router = express.Router();
const axios = require("axios");

const urlApiMarvel = process.env.MARVEL_API_URL;
const apiKey = process.env.MARVEL_API_KEY;

router.get("/characters", async (req, res) => {
  try {
    const { skip } = req.query;
    const name = req.query.name ? req.query.name : "";
    const limit = req.query.limit ? req.query.limit : 100;
    const callApiMarvel = await axios.get(
      `${urlApiMarvel}/characters?apiKey=${apiKey}&name=${name}&limit=${limit}&skip=${skip}`
    );
    if (callApiMarvel.status === 200) {
      if (callApiMarvel.data.results.length === 0) {
        res.status(404).json({ message: "No character found" });
      } else if (callApiMarvel.data.results.length > 0) {
        res.status(200).json(callApiMarvel.data);
      }
    }
  } catch (error) {
    console.log();
  }
});
module.exports = router;
