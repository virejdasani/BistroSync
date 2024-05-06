const request = require('supertest');
const app = require('../server');
const Ingredient = require('../src/models/ingredient');
const Supplier = require('../src/models/supplier');

const agent = request.agent(app);

function randomNumber() {
    return Math.floor(Math.random() * 100) + 1;
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

// Test GET stock
describe('GET /test/admin/stock', () => {
    it('It should GET the stock page', () => {
        return agent
            .get('/test/admin/stock')
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });
});

// Test GET low stock
describe('GET /test/admin/stock/low', () => {
    it('It should GET the low stock page', () => {
        return agent
            .get('/test/admin/stock/low')
            .then(response => {
                expect(response.statusCode).toBe(200);
            });
    });
});

// Test POST add stock
describe('POST /test/admin/stock/create', () => {
    it('It should add stock and return status code 200', () => {
        return agent
            .post('/test/admin/stock/create')
            .send({
                name: "Test Item",
                quantity: randomNumber(),
                price: randomNumber(),
                min: randomNumber(),
                company: "6612311e8c3ececc16d84f5a",
                supplier: "6615ada7079a82ba8f8a9149"
            })
            .then(async response => {
                let ingredient = await Ingredient.findOne({ name: "Test Item" });
                expect(ingredient).not.toBeNull();
                expect(response.statusCode).toBe(200);
                // delete
                await Ingredient.deleteOne({ name: "Test Item" });
            });
    });
});

// Test GET suppliers
describe('GET /test/admin/suppliers', () => {
    it('It should GET the suppliers in JSON format', () => {
        return agent
            .get('/test/admin/suppliers')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
            });
    });
});

// Test POST add supplier
describe('POST /test/admin/supplier/create', () => {
    it('It should add a supplier and redirect', () => {
        return agent
            .post('/test/admin/supplier/create')
            .send({
                name: "Test Supplier",
                email: "test@email.com",
                phone: "123456789",
                location: "Liverpool",
            })
            .then(async response => {
                let supplier = await Supplier.findOne({ name: "Test Supplier" });
                expect(supplier).not.toBeNull();
                expect(response.statusCode).toBe(200);
                await Supplier.deleteOne({ name: "Test Supplier" });
            });
    });
});
