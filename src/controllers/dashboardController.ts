import { Request, Response } from 'express';
import { getDashboardDataForUser } from '../services/dashboardService';
import { AppError } from '../utils/appError';

export const getDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userIdParam = req.query.userId ?? req.body?.userId;

    if (typeof userIdParam !== 'string' && typeof userIdParam !== 'number') {
      throw new AppError('El parámetro userId es obligatorio', 400);
    }

    const userId = Number(userIdParam);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new AppError('El parámetro userId debe ser un número entero positivo', 400);
    }

    const data = await getDashboardDataForUser(userId);
    res.json(data);
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(status).json({ message });
  }
};
