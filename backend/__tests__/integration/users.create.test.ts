import request from 'supertest';
import app from '../../src/app';
import User from '../../src/models/user.model';

const payload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  password: 'password123',
  phoneNumber: '1234567890'
};

describe('POST /api/users', () => {

  it('Should create a user a return 201 status', async () => {
    const response = await request(app).post('/api/users').send(payload).expect(201);

    // Checking the HTTP response
    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe(payload.email);
    expect(response.body.password).not.toBe(payload.password);

    // Checking the created user in DB

    const userInDB = await User.findOne({ email: payload.email }).lean();
    expect(userInDB).not.toBeNull();
  });

  it('Return Validation error when the payload is not valid', async () => {
    const inValidPayload = {
      firstName: 'John'
    };

    const response = await request(app).post('/api/users').send(inValidPayload).expect(400);

    expect(response.body.message).toContain('Validation');
  });

  it('Shoulf return 409 status if a user already exists', async () => {
    await request(app).post('/api/users').send(payload);
    const response = await request(app).post('/api/users').send(payload).expect(409);
    expect(response.body.message).toContain('User already Exists');
  });

});
