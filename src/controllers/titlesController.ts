import { Request, Response } from 'express';
import { findAvailableTitlesForUser } from '../services/requestService';

export const getAvailableTitles = async (req: Request, res: Response): Promise<void> => {
  const userIdParam = req.query.userId;

  if (!userIdParam) {
    res.status(400).json({ message: 'userId es obligatorio' });
    return;
  }

  const userId = Number(userIdParam);

  if (Number.isNaN(userId) || userId <= 0) {
    res.status(400).json({ message: 'userId debe ser un número positivo' });
    return;
  }

  try {
    const titles = await findAvailableTitlesForUser(userId);

    if (!titles.length) {
      res.status(200).json({ message: 'No hay títulos disponibles para solicitar', data: [] });
      return;
    }

    res.status(200).json({ data: titles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener títulos disponibles', error });
  }
};
