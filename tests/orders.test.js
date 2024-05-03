const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Checkout = require('../src/models/checkout');

const agent = request.agent(app);

function createCheckoutOrder() {
    Checkout.create({
        items: [
            {
                name: "Test Item",
                price: 10,
                foodId: 1,
                quantity: 2,
                status: "pending"
            }
        ],
        totalAmount: 20,
        tableNumber: 1,
        custName: "Test User",
        company: "6612311e8c3ececc16d84f5a",
        status: "pending"
    })
}

beforeAll((done) => {
    agent
        .post('/test/admin/login')
        .send({
            username: "admin",
            password: "admin"
        })
        .end(done);
});


// Test GET orders
describe('GET /test/admin/orders', () => {
    it('It should GET the orders for the dashboard', () => {
        return agent
            .get('/test/admin/orders')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
            });
    });
});

// Test GET past orders
describe('GET /test/admin/past_orders', () => {
    it('It should GET the past orders for the dashboard', () => {
        return agent
            .get('/test/admin/past_orders')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
            });
    });
});

// Test POST order. First create a checkout, then POST the order
describe('POST /test/admin/orders/:id', () => {
    it('It should mark the order as completed', async () => {
        await createCheckoutOrder();
        const lastOrder = await Checkout.findOne().sort({ createdAt: -1 });
        const foodId = lastOrder.items[0].foodId;
        console.log(`/test/admin/orders/${lastOrder._id}`);
        return agent
            .post(`/test/admin/orders/${lastOrder._id}`)
            .send({ 'foodId': foodId, 'status': 'completed' })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe("ok");
            });
    });
});