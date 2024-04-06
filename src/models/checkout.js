const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  tableNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

checkoutSchema.virtual("url").get(function () {
  return "/main/checkout/" + this._id;
});


module.exports = mongoose.model("Checkout", checkoutSchema);