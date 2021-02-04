const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  try {
    const { skip, title } = req.query;
    const limit = req.query.limit ? req.query.limit : 100;
    const callApiMarvel = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}&title=${title}&limit=${limit}&skip=${skip}`
    );

    if (callApiMarvel.status === 200) {
      res.status(200).json(callApiMarvel.data);
    } else {
      res.status(400).json(callApiMarvel.statusText);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
