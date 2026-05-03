const request = require('supertest');
const app = require('../index');

describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register with missing fields should return 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
    expect(res.statusCode).toBe(400);
  });

  it('POST /api/auth/login with wrong credentials should return 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nobody@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/auth/me without token should return 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

describe('Protected Routes', () => {
  it('GET /api/trades without token should return 401', async () => {
    const res = await request(app).get('/api/trades');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/portfolio without token should return 401', async () => {
    const res = await request(app).get('/api/portfolio');
    expect(res.statusCode).toBe(401);
  });
});
