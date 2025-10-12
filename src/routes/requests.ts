import { Router } from 'express';
import { createRequest } from '../controllers/requestsController';

const router = Router();

router.post('/', createRequest);

export default router;