/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { checkUserExistanceByMail, create as createUser, getAll, updateUserEmail } from '../../src/controlers/user.controler';


import bcrypt from 'bcrypt';
jest.mock('bcrypt');

import User from '../../src/models/user.model';
jest.mock('../../src/models/user.model');

// Ici nous avons mock jest et bcrypte parce qu'on ne veut pas les tester, on veut juste les utiliser pour nos tests
// Le mock de jest va intercepté l'import da chaque module et le remplacer par la version mocked
// Nous avons besoin de l'import, afin qu'on puisse controller et observer le mock

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

describe('User Middleware - checkUserExistanceByMail', () => {
  beforeEach(() => { // will execute before each test respresented by it
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(), // Using mockReturnThis here because in the controller we are using chaining so we should return the res before call send()
      send: jest.fn(),
    };

    next = jest.fn();
  });
  it('Should return a 400 error if the email is nothing in the request body', async () => {
    await checkUserExistanceByMail(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).toHaveBeenCalledWith(new Error('Email is not in the request'));
  });
  it('Should return a 409 error if the user has been found by email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({ _id: 'ExistsUserId' });
    req.body.email = 'testmail@mail.com';
    await checkUserExistanceByMail(req as Request, res as Response, next as NextFunction);

    expect(User.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(next).toHaveBeenCalledWith(new Error('User already Exists'));
  });

  it('Should call next() if the user was not found by email', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    req.body.email = 'testmail@mail.com';
    await checkUserExistanceByMail(req as Request, res as Response, next as NextFunction);

    expect(User.findOne).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

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


  it('Should create new user and resturn 201 with new user payload', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('HashedPassword' as never);

    const savedUser = { _id: 'newUserId', ...req.body, password: 'HashedPassword' };

    (User as any).mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(savedUser)
    }));

    await createUser(req as Request, res as Response, next as NextFunction);

    expect(User.findOne).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(userPayload.password, 10);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should call next with error on unexpected failure', async () => {
    const error = new Error('DB down');
    (User as any).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(error)
    }));

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

    jest.spyOn(User, 'find').mockResolvedValue(mockUsers);

    await getAll(req as Request, res as Response, next as NextFunction);

    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockUsers);
  });

  it('should call next with error if User.find throws', async () => {
    const error = new Error('Database error');
    jest.spyOn(User, 'find').mockRejectedValue(error);

    await getAll(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe('User controller - updateUserEmail', () => {
  beforeEach(() => {
    req = {
      body: { email: 'newemail@mail.com' },
      params: { id: 'userId' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('Should update the user and return 200 status with the updated user', async () => {
    const updatedUser = { _id: 'userId', email: 'newemail@mail.com' };
    jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(updatedUser);

    await updateUserEmail(req as Request, res as Response, next as NextFunction);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('userId', { email: 'newemail@mail.com' }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(updatedUser);
  });

  it('Should cann next with error on exception', async () => {
    const error = new Error('DB Error');
    jest.spyOn(User, 'findByIdAndUpdate').mockRejectedValue(error);
    await updateUserEmail(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalledWith(error);
  });
});
