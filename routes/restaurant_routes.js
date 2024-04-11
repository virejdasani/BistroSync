const express = require("express");
const router = express.Router();

const path = require("path");

router.use(express.static('src/restaurant'));

router.get("/", (req, res) => {
  res.sendFile(path.resolve("src/restaurant/index.html"));
});

router.post("/checkout", async (req, res) => {
  const Checkout = require("../src/models/checkout");
  const Ingredient = require("../src/models/ingredient");

  // Save checkout to database
  const tableNumber = req.body.tableNumber;
  const items = req.body.items;
  const custName = req.body.cardHolderName;
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const company = req.company;

  for (const item of items) {
    if (item.quantity > 1) {
      for (let i = 1; i < item.quantity; i++) {
        items.push({ ...item, quantity: 1 });
      }
      item.quantity = 1;
    }
  }

  await Checkout.create({
    items,
    totalAmount,
    tableNumber,
    custName,
    company
  });

  res.json({ status: "ok" });
});

module.exports = router;
