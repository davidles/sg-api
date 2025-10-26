import { Router } from 'express';
import { listMilitaryRanks } from '../controllers/militaryController';

const router = Router();

router.get('/ranks', listMilitaryRanks);

export default router;
