import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService';
import { AppError } from '../utils/appError';

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const authResult = await authenticateUser(req.body);
    res.json(authResult);
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(status).json({ message });
  }
};

export { login };
