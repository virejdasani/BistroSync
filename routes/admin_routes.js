const express = require('express');
const router = express.Router();

const path = require('path');
const User = require('../src/models/user.js');

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
    const Checkout = require('../src/models/checkout');
    const company = req.company;
    const pendingOrders = await Checkout.find({company, status: 'pending'}).populate('company');
    return res.json(pendingOrders);
});

router.get('/past_orders', async function(req, res) {
    const Checkout = require('../src/models/checkout');
    const company = req.company;
    const pastOrders = await Checkout.find({company, status: 'completed'}).populate('company');
    return res.json(pastOrders);
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
