import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
