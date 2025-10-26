import { Request, Response } from 'express';
import { getMilitaryRanks } from '../services/militaryService';

export const listMilitaryRanks = async (_req: Request, res: Response): Promise<void> => {
  const data = await getMilitaryRanks();
  res.json({ ranks: data });
};
