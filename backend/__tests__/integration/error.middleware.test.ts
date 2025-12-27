import request from 'supertest';
import app from '../../src/app';

describe('Error middleware', () => {

  it('should catch a thrown error and return proper status and message', async () => {
    const response = await request(app)
      .get('/test')
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('TESTING ERROR MIDDLEWARE');
  });

});
