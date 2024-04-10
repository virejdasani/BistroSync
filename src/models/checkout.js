const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      foodId: Number,
      quantity: Number,
      status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
      },
    },
  ],
  totalAmount: Number,
  tableNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  }
});

checkoutSchema.virtual("url").get(function () {
  return "/main/checkout/" + this._id;
});


module.exports = mongoose.model("Checkout", checkoutSchema);