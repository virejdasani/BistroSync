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

// Test the GET route
// describe('GET /orders', () => {
//   it('It should GET all the orders', async () => {
//     const res = await request(app).get('/test/admin/dashboard');
//     // if redirected to login
//     if (res.statusCode === 302) {
//       const login = await request(app).post('/test/admin/login').send({
//         username: "admin",
//         password: "admin"
//       });
//       expect(login.statusCode).toEqual(200);
//     }
//     expect(res.statusCode).toEqual(200);
//     //expect(res.body).toBeInstanceOf(Array);
//     console.log(res.body);
//   });
// });


// close the server after the tests
afterAll(async () => {
  await mongoose.connection.close();
});