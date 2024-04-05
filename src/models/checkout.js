const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
});

userSchema.virtual("url").get(function () {
  return "/main/user/" + this._id;
});

userSchema.statics.validate = async function (username, password) {
  console.log("Validating user");
  const foundUser = await this.findOne({ username });
  if (!foundUser) {
    return false;
  } else {
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
  }
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
