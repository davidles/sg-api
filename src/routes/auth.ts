import { Router } from 'express';
import { login } from '../controllers/authController';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController';

const router = Router();

router.post('/login', login);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset', resetPassword);

export default router;
