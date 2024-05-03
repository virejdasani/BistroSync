// For testing the orders API
const request = require('supertest');
const app = require('../server');

// Test GET login page
describe('GET /test/admin/login', () => {
  it('It should GET the login page', () => {
    return request(app)
      .get('/test/admin/login')
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});

// Test POST login
describe('POST /test/admin/login', () => {
  it('It should login and redirect', () => {
    return request(app)
      .post('/test/admin/login')
      .send({
        username: "admin",
        password: "admin"
      })
      .then(response => {
        expect(response.statusCode).toBe(302);
      });
  });
});

// Test invalid login
describe('POST /test/admin/login', () => {
  it('It should not login and return to login page with error query string', () => {
    return request(app)
      .post('/test/admin/login')
      .send({
        username: "admin",
        password: "wrongpassword"
      })
      .then(response => {
        expect(response.statusCode).toBe(302);
        expect(response.header.location).toBe('login?username=admin&error=1');
      });
  });
});