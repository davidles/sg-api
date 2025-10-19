import { Router } from 'express';
import { getAvailableTitles } from '../controllers/titlesController';

const router = Router();

router.get('/available', getAvailableTitles);

export default router;
