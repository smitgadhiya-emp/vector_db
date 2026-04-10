import { Request, Response, NextFunction } from 'express';
import {
  createUser as createUserService,
  findAllUsers,
  findUserById,
  updateUserById,
  deleteUserById,
  findQueryResults
} from './user.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bio = typeof req.query.bio === 'string' ? req.query.bio : undefined;
    const users = await findAllUsers(bio);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deleteUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
  } catch (err) {
    next(err);
  }
};

export const getQueryUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {query} = req.query;
    console.log("Received query:", query);
    if (typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query parameter is required and must be a string' });
    }

     const userQuey = await findQueryResults(query);
     res.json({ success: true, message: 'Query results found', data: userQuey });
  } catch (error) {
    console.error("Error in getQueryUser:", error);
    next(error);
  }

}