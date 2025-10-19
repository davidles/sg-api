import { Router } from 'express';
import { getFormData, updateFormData } from '../controllers/formController';

const router = Router();

router.get('/:userId', getFormData);
router.put('/:userId', updateFormData);

export default router;
