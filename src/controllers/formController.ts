import { Request, Response } from 'express';
import { getFormDataForUser, updateFormDataForUser } from '../services/formService';

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

export const updateFormData = async (req: Request, res: Response): Promise<void> => {
  const userIdParam = req.params.userId;
  const userId = Number(userIdParam);

  if (!userIdParam || Number.isNaN(userId) || userId <= 0) {
    res.status(400).json({ message: 'userId debe ser un número positivo' });
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ message: 'El cuerpo de la solicitud es obligatorio' });
    return;
  }

  try {
    const updatedForm = await updateFormDataForUser(userId, req.body);
    res.status(200).json({ data: updatedForm });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
