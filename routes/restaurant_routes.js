const express = require("express");
const router = express.Router();

const path = require("path");

router.use(express.static('src/restaurant'));

router.get("/", (req, res) => {
  res.sendFile(path.resolve("src/restaurant/index.html"));
});

module.exports = router;
