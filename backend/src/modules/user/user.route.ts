import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getQueryUser,
} from './user.controller';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/query', getQueryUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
