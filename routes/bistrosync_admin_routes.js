const express = require('express');
const path = require('path');
const Company = require('../src/models/company');
const router = express.Router();

router.use(express.static('src/bistrosync'));

router.get('/', (req, res) => {
    res.sendFile(path.resolve('src/bistrosync/index.html'));
});

router.route('/companies')
    .get((req, res) => {
        res.sendFile(path.resolve('src/bistrosync/companies.html'));
    })
    .post((req, res) => {
        // save copmany to database


        res.json({status: 'ok'});
    });



module.exports = router;
