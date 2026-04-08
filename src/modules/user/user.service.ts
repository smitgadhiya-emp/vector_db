import { User } from './user.model';
import { IUser } from './user.interface';

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {

  return await User.create(data);
};

export const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find().sort({ createdAt: -1 });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

export const updateUserById = async (
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteUserById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};
