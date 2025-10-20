import { Router } from 'express';
import { getFormData, updateFormData, generateFormPdf } from '../controllers/formController';

const router = Router();

router.get('/:userId', getFormData);
router.put('/:userId', updateFormData);
router.post('/:userId/pdf', generateFormPdf);

export default router;
