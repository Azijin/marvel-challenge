const express = require("express");
const router = express.Router();
const axios = require("axios");

const urlApiMarvel = process.env.MARVEL_API_URL;

router.get("/comics", async (req, res) => {
  try {
    const { skip } = req.query;
    const title = req.query.title ? req.query.title : "";
    const limit = req.query.limit ? req.query.limit : 100;
    const callApiMarvel = await axios.get(
      `${urlApiMarvel}/comics?apiKey=${process.env.MARVEL_API_KEY}&title=${title}&limit=${limit}&skip=${skip}`
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

router.get("/comics/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).json({ message: "Missing id params" });
    } else {
      const callApiMarvel = await axios.get(
        `${urlApiMarvel}/comics/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`
      );
      console.log(callApiMarvel);
      if (callApiMarvel.status === 200) {
        if (callApiMarvel.data === null) {
          res.status(404).json({
            message:
              "This character does not appear in any comic book in our database",
          });
        } else if (callApiMarvel.data) {
          res.status(200).json({ data: callApiMarvel.data, message: "trouvé" });
        }
      } else {
        res.status(400).json(callApiMarvel);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
