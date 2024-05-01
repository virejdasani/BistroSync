// For testing the orders API
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Checkout = require('../src/models/checkout');

//require('dotenv').config();
// connect to the database
beforeAll(async () => {
    const url = "mongodb+srv://mparry:p7hgC7pqq8pnL3n2@bistrosync.lawrdxq.mongodb.net/?retryWrites=true&w=majority&appName=BistroSync";
    await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Test GET login page
describe('GET /test/admin/login', () => {
  it('It should GET the login page', async () => {
    const res = await request(app).get('/test/admin/login');
    expect(res.statusCode).toEqual(200);
  });
});

// Test POST login
describe('POST /test/admin/login', () => {
  it('It should login and redirect', async () => {
    const res = await request(app).post('/test/admin/login').send({
      username: "admin",
      password: "admin"
    });
    // expects a redirect
    expect(res.statusCode).toEqual(302);
  });
});

// Test invalid login
describe('POST /test/admin/login', () => {
  it('It should not login and return to login page with error query string', async () => {
    const res = await request(app).post('/test/admin/login').send({
      username: "admin",
      password: "wrongpassword"
    });
    // expects a redirect
    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toEqual('login?username=admin&error=1');
  });
});

