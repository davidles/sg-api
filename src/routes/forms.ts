import { Router } from 'express';
import { getFormData } from '../controllers/formController';

const router = Router();

router.get('/:userId', getFormData);

export default router;
