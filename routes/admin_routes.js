const express = require('express');
const router = express.Router();

const path = require('path');
const User = require('../src/models/user.js');
const Checkout = require('../src/models/checkout');
const Ingredient = require('../src/models/ingredient');
const Supplier = require('../src/models/supplier');
const PurchaseOrder = require('../src/models/purchase_order');

router.use(express.static('src/admin'));

router.get('/', function(req, res) {
    res.redirect('dashboard');
});

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

router.get('/logout', function(req, res) {
    const company = req.company;
    req.session.user_id = null;
    req.session.username = null;
    req.company = null;
    res.redirect(`/${company}/admin/login`);
});

router.get('/dashboard', function(req, res) {
    res.sendFile(path.resolve("src/admin/dashboard.html"));
});

router.get('/sales', async function(req, res) {
    const from_date = req.query.from;
    let to_date = req.query.to;
    const company = req.company;

    to_date = new Date(to_date);
    if (to_date == from_date) {
        to_date.setDate(to_date.getDate() + 1);
    }
    to_date.setHours(23);

    checkouts = await Checkout.find({company:company, createdAt: {$gte: from_date, $lt: to_date}});

    let total = 0;
    checkouts.forEach(checkout => {
        checkout.items.forEach(item => {
            total += item.price * item.quantity;
        });
    });

    total = Math.round((total + Number.EPSILON) * 100) / 100;

    return res.json({total});
});


router.get('/orders', async function(req, res) {
    const company = req.company;
    const pendingOrders = await Checkout.find({company, status: 'pending'}).populate('company');

    // only show items that are not completed
    pendingOrders.forEach(order => {
        order.items = order.items.filter(item => item.status !== 'completed');
    });

    return res.json(pendingOrders);
});

router.get('/past_orders', async function(req, res) {
    const from = req.query.from;
    let to = req.query.to;
    const company = req.company;
    let pastOrders = await Checkout.find({company, status: 'completed'});

    if (from && to) {
        to = new Date(to);
        if (to == from) {
            to.setDate(to.getDate() + 1);
        }

        // set to to end of day
        to.setHours(23);

        pastOrders = await Checkout.find({company, status: 'completed', createdAt: {$gte: from, $lte: to}});
    }

    pastOrders.forEach(order => {
        order.items = order.items.filter(item => item.status === 'completed');
    });
    return res.json(pastOrders);
});

router.post('/orders/:id', async function(req, res) {
    if (req.body.status !== 'completed') {
        return res.status(400).json({error: 'Invalid status'});
    }

    const foodId = req.body.foodId;
    const order = await Checkout.findById(req.params.id).populate('company');

    // fetch api to get ingredients of order
    fetch("https://raw.githubusercontent.com/virejdasani/BistroSync/main/src/api/menu.json")
        .then((response) => response.json())
        .then(async (data) => {
            var ingredients;

            for (let key in data.menu) {
                for (let key2 in data.menu[key]) {
                    if (data.menu[key][key2].id == foodId) {
                        ingredients = data.menu[key][key2].ingredients;
                        break;
                    }
                }
            }

            ingredients.forEach(async ingredient => {

                ingredient = ingredient.toLowerCase().replace(/\s/g, '');
                const stock = await Ingredient.findOne({name: { $regex: new RegExp('^' + ingredient + '$', 'i') }, company: order.company});

                if (stock) {
                    stock.quantity -= 1;
                    // auto create purchase order if stock is low
                    if (stock.quantity < stock.min) {
                        const order = await PurchaseOrder.create({company: stock.company, supplier: stock.supplier,
                                                                  items: [{ingredient: stock, quantity: stock.min - stock.quantity}]});
                    }
                    await stock.save();
                } else {
                    console.log("no stock");
                }
            });

            if (order && order.company._id.toString() === req.company.toString()) {
                let allCompleted = true;
                order.items.forEach(item => {
                    if (item.foodId == foodId) {
                        item.status = 'completed';
                    }
                    if (item.status !== 'completed') {
                        allCompleted = false;
                    }
                });

                if (allCompleted) {
                    // order is completed
                    order.status = 'completed';
                    order.custName = '';
                }

                await order.save();
                return res.json({status: 'ok'});
            }
        })
});

router.get('/stock', async function(req, res) {
    const company = req.company;
    const ingredients = await Ingredient.find({company: company}).populate('supplier');
    return res.json(ingredients);
});

router.get('/stock/low', async function(req, res) {
    const company = req.company;
    // find all ingredients that are low in stock
    const ingredients = await Ingredient.aggregate([
        {$match: {company: company}},
        {$addFields: {low: {$lt: ['$quantity', '$min']}}},
        {$match: {low: true}}
    ]);
    return res.json(ingredients);
});

router.post('/stock/create', async function(req, res) {
    const {name, quantity, price, min, supplier} = req.body;
    const unit = 'unit'; // testing
    const company = req.company;
    await Ingredient.create({name, quantity, unit, min, price, supplier, company});
    return res.json({status: 'ok'});
});

// list all purchase orders and handle creation
router.route('/purchase_order')
    .get(async function(req, res) {
        wip_pos = await PurchaseOrder.find({company: req.company, status: 'pending'})
                               .populate('supplier').populate('items.ingredient');
        completed_pos = await PurchaseOrder.find({company: req.company, status: 'delivered'})
                                     .populate('supplier').populate('items.ingredient');

        return res.json({wip_pos, completed_pos});
    })
    .post(async function(req, res) {
        const {id, quantity} = req.body;
        const ingredient = await Ingredient.findById(id);
        const company = req.company;
        const order = await PurchaseOrder.create({company, supplier: ingredient.supplier,
                                                    items: [{ingredient, quantity}]});
        return res.json({status: 'ok', order});
    });

router.post('/purchase_order/:id', async function(req, res) {
    const order = await PurchaseOrder.findById(req.params.id);
    if (order && order.company.toString() === req.company.toString()) {
        order.status = 'delivered';
        await order.save();
        // update stock
        order.items.forEach(async item => {
            const stock = await Ingredient.findById(item.ingredient);
            stock.quantity += item.quantity;
            await stock.save();
        });
        return res.json({status: 'ok'});
    }
});

router.get('/purchase_order/costs', async function(req, res) {
    const company = req.company;
    const from = req.query.from;
    let to = req.query.to;
    let orders;
    if (from && to) {
        to = new Date(to);
        if (to == from) {
            to.setDate(to.getDate() + 1);
        }
        to.setHours(23);
        orders = await PurchaseOrder.find({company: company, status: 'delivered', createdAt: {$gte: from, $lt: to}}).populate('items.ingredient');
    } else {
        orders = await PurchaseOrder.find({company: company, status: 'delivered'}).populate('items.ingredient');
    }

    let total = 0;
    orders.forEach(order => {
        order.items.forEach(item => {
            total += item.quantity * item.ingredient.price;
        });
    });
    return res.json({total});
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
