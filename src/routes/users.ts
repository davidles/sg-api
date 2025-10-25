import { Router } from 'express';
import { listUsers, register } from '../controllers/usersController';

const router = Router();

router.get('/', listUsers);
router.post('/register', register);

export default router;
