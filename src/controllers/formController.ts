import { Request, Response } from 'express';
import { getFormDataForUser } from '../services/formService';

export const getFormData = async (req: Request, res: Response): Promise<void> => {
  const userIdParam = req.params.userId;

  const userId = Number(userIdParam);

  if (!userIdParam || Number.isNaN(userId) || userId <= 0) {
    res.status(400).json({ message: 'userId debe ser un número positivo' });
    return;
  }

  try {
    const formData = await getFormDataForUser(userId);
    res.status(200).json({ data: formData });
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};
