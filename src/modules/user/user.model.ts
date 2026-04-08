import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    avatar: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
