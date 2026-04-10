import { Request, Response, NextFunction } from 'express';
import { sendError, sendSuccess } from '../../utils/response.util';
import {
  createUser as createUserService,
  findAllUsers,
  findUserById,
  updateUserById,
  deleteUserById,
  findQueryResults,
} from './user.service';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUserService(req.body);
    return sendSuccess(res, { data: user, statusCode: 201 });
  } catch (err) {
    sendError(res, err as Error || 'Internal Server Error', 500);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bio = typeof req.query.bio === 'string' ? req.query.bio : undefined;
    const users = await findAllUsers(bio);
    return sendSuccess(res, { data: users });
  } catch (err) {
    sendError(res, err as Error || 'Internal Server Error', 500);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { data: user });
  } catch (err) {
    sendError(res, err as Error || 'Internal Server Error', 500);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserById(req.params.id, req.body);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { data: user });
  } catch (err) {
    sendError(res, err as Error || 'Internal Server Error', 500);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deleteUserById(req.params.id);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { data: user });
  } catch (err) {
    sendError(res, err as Error || 'Internal Server Error', 500);
  }
};

export const getQueryUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query;
    if (typeof query !== 'string') {
      return sendError(res, 'Query parameter is required and must be a string', 400);
    }

    const queryResult = await findQueryResults(query);
    return sendSuccess(res, { message: 'Query results found', data: queryResult });
  } catch (error) {
    console.error('Error in getQueryUser:', error);
    sendError(res, error as Error || 'Internal Server Error', 500);
  }
};
