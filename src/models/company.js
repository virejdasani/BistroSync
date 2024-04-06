const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: Number,
        default: null
    },
    location: {
        type: String,
        required: true
    },
    employees: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

