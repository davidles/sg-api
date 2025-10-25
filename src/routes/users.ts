import { Router } from 'express';
import { listUsers } from '../controllers/usersController';

const router = Router();

router.get('/', listUsers);

export default router;
