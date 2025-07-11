import { Document } from 'mongoose';

declare interface IUser extends Document {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string,
}
