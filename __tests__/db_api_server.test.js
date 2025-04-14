const request = require('supertest');
const app = require('../db_api_server');

describe('Database API Server', () => {
  it('GET /api/status should return table counts', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.counts).toHaveProperty('user_count');
  });

  it('POST /api/reset should reset DB schema', async () => {
    const res = await request(app).post('/api/reset');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('POST /api/seed should populate test data', async () => {
    const res = await request(app).post('/api/seed');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  it('POST /api/seed/test-user should create a user', async () => {
    const res = await request(app).post('/api/seed/test-user').send({
      email: 'devtest@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('devtest@example.com');
  });
});
