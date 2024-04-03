const express = require("express");
const app = express();
const port = 3000;

const restaurantRouter = require("./routes/restaurant_routes");
const adminRouter = require("./routes/admin_routes");

const mongoose = require('mongoose');

const url = "mongodb+srv://mparry:p7hgC7pqq8pnL3n2@bistrosync.lawrdxq.mongodb.net/?retryWrites=true&w=majority&appName=BistroSync";
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(callback) {
   console.log("Database Connection succeeded");
})

app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/restaurant");
});

app.use("/restaurant", restaurantRouter);

app.use("/restaurant/admin", adminRouter);

app.use((err, req, res, next) => {
  console.log("ERROR: " + err.message);
  res.status(500).send("Error: " + err.message);
});

app.listen(port, () => {
  console.log("Started server");
});
