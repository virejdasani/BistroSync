const express = require('express');
const router = express.Router();

const path = require('path');

router.get('/', function(req, res) {
    res.redirect('login');
});

router.route('/login')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/login.html"));
    })
    .post(function(req, res) {
        res.send('login post');
    });

module.exports = router;
