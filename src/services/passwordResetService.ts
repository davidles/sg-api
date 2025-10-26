import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import models from '../models';
import { sendResetPasswordEmail } from '../utils/mailer';
import { AppError } from '../utils/appError';

const TOKEN_BYTES = 32;
const TOKEN_TTL_SECONDS = Number(process.env.RESET_TOKEN_TTL ?? 3600);
const SALT_ROUNDS = 12;

const normalizeIdentifier = (identifier: unknown): string => {
  if (typeof identifier !== 'string' || identifier.trim() === '') {
    throw new AppError('El identificador es obligatorio', 400);
  }
  return identifier.trim().toLowerCase();
};

export const createResetToken = async (identifier: unknown): Promise<{ resetUrl: string }> => {
  const normalized = normalizeIdentifier(identifier);

  const user = await models.user.findOne({ where: { username: normalized } });

  if (!user) {
    return { resetUrl: '' };
  }

  const token = crypto.randomBytes(TOKEN_BYTES).toString('base64url');
  const tokenHash = await bcrypt.hash(token, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000);

  await models.passwordResetToken.create({
    userId: user.getDataValue('idUser'),
    tokenHash,
    expiresAt
  });

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

  // Try to send email to the username (stored as email)
  const to = user.getDataValue('username');
  if (to && typeof to === 'string' && to.includes('@')) {
    try {
      await sendResetPasswordEmail(to, resetUrl);
    } catch (err) {
      // Do not fail the flow if email sending has issues
    }
  }

  return { resetUrl };
};

export const resetPasswordWithToken = async (token: unknown, newPassword: unknown): Promise<void> => {
  if (typeof token !== 'string' || token.trim() === '') {
    throw new AppError('Token inválido', 400);
  }
  if (typeof newPassword !== 'string' || newPassword.trim().length < 8) {
    throw new AppError('La contraseña debe tener al menos 8 caracteres', 400);
  }

  const candidateTokens = await models.passwordResetToken.findAll({
    where: {
      usedAt: { [Op.is]: null },
      expiresAt: { [Op.gt]: new Date() }
    },
    order: [['createdAt', 'DESC']]
  });

  let matched: typeof candidateTokens[number] | null = null;
  for (const t of candidateTokens) {
    const match = await bcrypt.compare(token, t.getDataValue('tokenHash'));
    if (match) {
      matched = t;
      break;
    }
  }

  if (!matched) {
    throw new AppError('El token es inválido o expiró', 400);
  }

  const userId = matched.getDataValue('userId');
  const passwordHash = await bcrypt.hash(newPassword.trim(), SALT_ROUNDS);

  await models.user.update(
    { password: passwordHash },
    { where: { idUser: userId } }
  );

  await matched.update({ usedAt: new Date() });
};
