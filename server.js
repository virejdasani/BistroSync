const express = require("express");
const app = express();
const port = 3000;

const restaurantRouter = require("./routes/restaurant_routes");
const adminRouter = require("./routes/admin_routes");

const mongoose = require('mongoose');

//const mongoDB = 'connection....';
//mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
//const db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//db.once('open', function(callback) {
//    console.log("Database Connection succeeded");
//})

app.use(express.static("src"));

app.get("/", (req, res) => {
  res.redirect("/restaurant");
});

app.get("/admin", (req, res) => {
  res.sendFile("src/admin/index.html", { root: __dirname });
});

app.get("/restaurant", (req, res) => {
  res.sendFile("src/restaurant/index.html", { root: __dirname });
});

app.use("/restaurant", restaurantRouter);

app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log("Started server");
});
