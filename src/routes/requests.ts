import { Router } from 'express';
import { createRequest } from '../controllers/requestsController';
import {
  getRequestRequirements,
  uploadRequestRequirementFile,
  downloadRequestRequirementFile
} from '../controllers/requestRequirementsController';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

router.post('/', createRequest);
router.get('/:requestId/requirements', getRequestRequirements);
router.post(
  '/:requestId/requirements/:requirementInstanceId/file',
  uploadMiddleware.single('file'),
  uploadRequestRequirementFile
);
router.get('/:requestId/requirements/:requirementInstanceId/file', downloadRequestRequirementFile);

export default router;