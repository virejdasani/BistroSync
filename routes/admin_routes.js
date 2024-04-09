const express = require('express');
const router = express.Router();

const path = require('path');
const User = require('../src/models/user.js');
const Checkout = require('../src/models/checkout');
const Ingredient = require('../src/models/ingredient');
const Supplier = require('../src/models/supplier');

router.use(express.static('src/admin'));

router.route('/login')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/login.html"));
    })
    .post(async function(req, res) {
        const {username, password} = req.body;
        const restaurant = req.company;
        if (validate(username, password)) {
            try {
                const user = await User.validate(username, password); // Validates username and password form model
                if (user) {
                    req.session.user_id = user._id;
                    req.session.username = user.username;
                    res.redirect('dashboard');
                } else {
                    let querystring = `?username=${username}&error=1`;
                    res.redirect('login' + querystring);
                }
            } catch (err) {
                res.redirect('login?error=2');
            }
        } else {
            res.redirect('login?error=1');
        }
    });

router.route('/dashboard')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/dashboard.html"));
    });

router.route('/logout')
    .get(function(req, res) {
        const company = req.company;
        req.session.user_id = null;
        req.session.username = null;
        req.company = null;
        res.redirect(`/${company}/admin/login`);
    });

router.get('/orders', async function(req, res) {
    const company = req.company;
    const pendingOrders = await Checkout.find({company, status: 'pending'}).populate('company');
    return res.json(pendingOrders);
});

router.get('/past_orders', async function(req, res) {
    const company = req.company;
    const pastOrders = await Checkout.find({company, status: 'completed'}).populate('company');
    return res.json(pastOrders);
});

router.post('/orders/:id', async function(req, res) {
    if (req.body.status !== 'completed') {
        return res.status(400).json({error: 'Invalid status'});
    }

    const order = await Checkout.findById(req.params.id).populate('company');
    if (order && order.company._id.toString() === req.company.toString()) {
        order.status = 'completed';
        await order.save();
        return res.json({status: 'ok'});
    }
});

router.get('/stock', async function(req, res) {
    const company = req.company;
    const ingredients = await Ingredient.find({company: company});
    return res.json(ingredients);
});

router.post('/stock/create', async function(req, res) {
    const {name, quantity, price, min, supplier} = req.body;
    const company = req.company;
    await Ingredient.create({name, quantity, price, min, supplier, company});
    return res.json({status: 'ok'});
});

// get suppliers to fill dropdown in create ingredient form
router.get('/suppliers', async function(req, res) {
    const company = req.company;
    const suppliers = await Supplier.find({company: company});
    return res.json(suppliers);
});

router.post('/supplier/create', async function(req, res) {
    const {name, phone, email, location} = req.body;
    const date = new Date();
    const company = req.company;
    await Supplier.create({name, email, phone, location, date, company});
    return res.json({status: 'ok'});
});

function validate(username, password) {
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/; // Temporary validation
    if (username && password) {
        if (regex.test(username) || regex.test(password)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

module.exports = router;
