const express = require('express');
const router = express.Router();

const path = require('path');

router.use(express.static('src/admin'));

router.get('/', function(req, res) {
    res.redirect('login');
});

router.route('/login')
    .get(function(req, res) {
        res.sendFile(path.resolve("src/admin/login.html"));
    })
    .post(function(req, res) {
        const {username, password} = req.body;
        res.send(`Username: ${username}, Password: ${password}`);
    });

module.exports = router;
