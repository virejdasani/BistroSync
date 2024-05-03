const session = require('express-session');
const express = require("express");
const app = express();
const port = 3000;

const restaurantRouter = require("./routes/restaurant_routes");
const adminRouter = require("./routes/admin_routes");
const bistrosyncAdminRouter = require("./routes/bistrosync_admin_routes");
const Company = require("./src/models/company");

const mongoose = require('mongoose');
const url = "mongodb+srv://mparry:p7hgC7pqq8pnL3n2@bistrosync.lawrdxq.mongodb.net/?retryWrites=true&w=majority&appName=BistroSync";
mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (callback) {
    console.log("Database Connection succeeded");
})

app.use(express.static("src"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'Secret_Key', resave: false, saveUninitialized: false }));

app.use((err, req, res, next) => {
    console.log("ERROR: " + err.message);
    res.status(500).send("Error: " + err.message);
});

app.get("/", (req, res) => {
    res.redirect("/test");
});

app.use("/:restaurant", async (req, res, next) => {
    // Check if restaurant exists
    const restaurant = req.params.restaurant;
    const company = await Company.findOne({ name: restaurant });

    if (!company) {
        res.status(404).send("Restaurant not found");
        return;
    }

    req.company = company._id;
    return next();

}, restaurantRouter);

app.use("/:restaurant/admin", (req, res, next) => {
    if (req.path !== '/login') {
        const restaurant = req.company;
        return !req.session.user_id ? res.redirect('login') : next();
    } else {
        next();
    }
}, adminRouter);

app.use("/bistrosync/admin", bistrosyncAdminRouter);


if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log("Started server");
    });
}


module.exports = app;