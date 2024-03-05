const express = require("express");
const app = express();
const port = 3000;

const restaurantRouter = require("./routes/restaurant_routes");
const adminRouter = require("./routes/admin_routes");

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
