import { Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { createResetToken, resetPasswordWithToken } from '../services/passwordResetService';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body ?? {};
    await createResetToken(email);
    res.json({ message: 'Si tu correo está registrado, te enviamos un enlace para restablecer tu contraseña.' });
  } catch (error) {
    // No revelar detalles
    res.json({ message: 'Si tu correo está registrado, te enviamos un enlace para restablecer tu contraseña.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body ?? {};
    await resetPasswordWithToken(token, password);
    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 400;
    const message = error instanceof Error ? error.message : 'No fue posible actualizar la contraseña';
    res.status(status).json({ message });
  }
};
