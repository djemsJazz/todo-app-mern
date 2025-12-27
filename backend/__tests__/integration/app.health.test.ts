import request from 'supertest';
import app from '../../src/app';

describe('App integration - base behavior Health Test', () => {
  it('Should return 404 error for unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.status).toBe(404);
  });
  it('Should trigger Error middleware on /test route', async () => {
    const res = await request(app).get('/test-auth');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });
});
