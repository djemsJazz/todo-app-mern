import { Request, Response, NextFunction } from 'express';
import { create as createUser, getAll } from '../src/controlers/user.controler';
import bcrypt from 'bcrypt';
import User from '../src/models/user.model';


jest.mock('../src/models/user.model');
jest.mock('bcrypt');

let req: Partial<Request>;
let res: Partial<Response>;
let next: Partial<NextFunction>;

const userPayload = {
  firstName: 'Test firstName',
  lastName: 'Test lastName',
  email: 'testmail@mail.com',
  password: 'TestPassword',
  phoneNumber: 'Test phoneNumber',
};

describe('User controller - create', () => {
  beforeEach(() => { // Cette will execute before each test respresented by it
    req = {
      body: userPayload
    };

    res = {
      status: jest.fn().mockReturnThis(), // Using mockReturnThis here because in the controller we are using chaining so we should return the res before call send()
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it('Should retrun 409 if user already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ _id: 'Exists' });

    await createUser(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(next).toHaveBeenCalledWith(new Error('User already Exists'));
  });

  it('Should create new user and resturn 201 with new user payload', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('HashedPassword');

    const savedUser = { _id: 'newUserId', ...req.body, password: 'HashedPassword' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (User as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedUser)
    }));

    await createUser(req as Request, res as Response, next as NextFunction);

    expect(bcrypt.hash).toHaveBeenCalledWith('TestPassword', 10);

  });

  it('should call next with error on unexpected failure', async () => {
    const error = new Error('DB down');
    (User.findOne as jest.Mock).mockRejectedValue(error);

    await createUser(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('User controller - getAll', () => {
  it('should return all users with status 200', async () => {
    const mockUsers = [
      { _id: '1', ...userPayload },
      { _id: '2', ...userPayload },
    ];

    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    await getAll(req as Request, res as Response, next as NextFunction);

    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockUsers);
  });

  it('should call next with error if User.find throws', async () => {
    const error = new Error('Database error');
    (User.find as jest.Mock).mockRejectedValue(error);

    await getAll(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});