const express = require("express");
const app = express();
const port = 3000;

const customerRouter = require("./routes/cust_routes");
const adminRouter = require("./routes/admin_routes");

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.use("/customer", customerRouter);

app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log("Started server");
});
