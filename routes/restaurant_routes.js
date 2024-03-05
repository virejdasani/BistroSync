const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("restaurant side");
});

module.exports = router;
