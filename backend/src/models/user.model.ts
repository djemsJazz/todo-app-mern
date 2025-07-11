import { model, Schema } from 'mongoose';
import { IUser } from '../types/user';

const useSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const User = model<IUser>('User', useSchema);

export default User;
