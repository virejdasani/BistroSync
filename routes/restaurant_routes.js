const express = require("express");
const router = express.Router();

const path = require("path");

router.use(express.static('src/restaurant'));

router.get("/", (req, res) => {
  res.sendFile(path.resolve("src/restaurant/index.html"));
});

router.post("/checkout", (req, res) => {
  const Checkout = require("../src/models/checkout");

  // Save checkout to database
  var tableNumber = req.body.tableNumber;
  var items = req.body.items;
  var totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  var company = req.company;

  const checkout = new Checkout({
    items,
    totalAmount,
    tableNumber,
    company,
  });
  checkout.save();

  res.json({ status: "ok" });
});

module.exports = router;
