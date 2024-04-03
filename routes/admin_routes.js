const express = require('express');
const router = express.Router();

const path = require('path');
const User = require('../src/models/user.js');

router.use(express.static('src/admin'));

router.get('/', function(req, res) {
    res.redirect('login');
});

router.route('/login')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/login.html"));
    })
    .post(async function(req, res) {
        const {username, password} = req.body;
        if (validate(username, password)) {
            try {
                const user = await User.validate(username, password); // Validates username and password form model
                if (user) {
                    req.session.user_id = user._id;
                    req.session.username = user.username;
                    res.redirect('/restaurant/admin/dashboard');
                } else {
                    let querystring = `?username=${username}&error=1`;
                    res.redirect('/restaurant/admin/login' + querystring);
                }
            } catch (err) {
                res.redirect('/restaurant/admin/login?error=2');
            }
        }
    });

router.route('/dashboard')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/dashboard.html"));
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
