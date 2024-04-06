const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});

const Supplier = mongoose.model('Supplier', supplierSchema);