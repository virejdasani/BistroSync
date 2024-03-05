const express = require('express');
const router = express.Router();

const path = require('path');

router.get('/', (req, res) => {
    res.send('admin side');
});

router.get('/login', (req, res) => {
    res.sendFile(path.resolve("src/admin/login.html"));
});


module.exports = router;
