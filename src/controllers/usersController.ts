import { Request, Response } from 'express';
import models from '../models';
import { USER_DEFAULT_INCLUDE, registerUser } from '../services/authService';
import { AppError } from '../utils/appError';
import { serializeUser } from '../utils/serializeUser';

const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await models.user.findAll({
      include: USER_DEFAULT_INCLUDE,
      order: [['idUser', 'ASC']]
    });

    const serializedUsers = users.map(serializeUser);

    res.json(serializedUsers);
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : 'Error desconocido';
    res.status(status).json({ message });
  }
};

export { listUsers, register };
