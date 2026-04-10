import { Router } from 'express';
import userRoutes from '../modules/user/user.route';
import vectorizeRoutes from '../modules/vectorize/vectorize.route';

const router = Router();

router.use('/users', userRoutes);
router.use('/upload', vectorizeRoutes);

export default router;
