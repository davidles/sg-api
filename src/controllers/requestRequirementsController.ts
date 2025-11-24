import { Request, Response } from 'express';
import {
  getRequirementsForRequest,
  uploadRequirementFileForRequest,
  getRequirementFileForRequest
} from '../services/requestRequirementService';

export const getRequestRequirements = async (req: Request, res: Response): Promise<void> => {
  const { requestId } = req.params;
  const { status } = req.query;

  const parsedRequestId = Number(requestId);

  if (!requestId || Number.isNaN(parsedRequestId) || parsedRequestId <= 0) {
    res.status(400).json({ message: 'requestId debe ser un número positivo' });
    return;
  }

  const statusFilters = Array.isArray(status)
    ? status.map((value) => String(value))
    : typeof status === 'string'
      ? status.split(',')
      : undefined;

  try {
    const items = await getRequirementsForRequest(parsedRequestId, statusFilters);
    res.status(200).json({ data: items });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const downloadRequestRequirementFile = async (req: Request, res: Response): Promise<void> => {
  const { requestId, requirementInstanceId } = req.params;

  const parsedRequestId = Number(requestId);
  const parsedRequirementInstanceId = Number(requirementInstanceId);

  if (!requestId || Number.isNaN(parsedRequestId) || parsedRequestId <= 0) {
    res.status(400).json({ message: 'requestId debe ser un número positivo' });
    return;
  }

  if (
    !requirementInstanceId ||
    Number.isNaN(parsedRequirementInstanceId) ||
    parsedRequirementInstanceId <= 0
  ) {
    res.status(400).json({ message: 'requirementInstanceId debe ser un número positivo' });
    return;
  }

  try {
    const filePayload = await getRequirementFileForRequest(parsedRequestId, parsedRequirementInstanceId);

    res.setHeader('Content-Type', filePayload.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filePayload.fileName}"`);
    res.status(200).send(filePayload.buffer);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

type RequestWithFile = Request & {
  file?: {
    path: string;
  };
};

export const uploadRequestRequirementFile = async (req: Request, res: Response): Promise<void> => {
  const { requestId, requirementInstanceId } = req.params;
  const { nextStatusId, reviewReason } = req.body ?? {};
  const userId = Number(req.body?.userId ?? req.query.userId);

  const parsedRequestId = Number(requestId);
  const parsedRequirementInstanceId = Number(requirementInstanceId);
  const parsedNextStatusId =
    typeof nextStatusId === 'number'
      ? nextStatusId
      : typeof nextStatusId === 'string' && nextStatusId.trim() !== ''
        ? Number(nextStatusId)
        : undefined;

  if (!requestId || Number.isNaN(parsedRequestId) || parsedRequestId <= 0) {
    res.status(400).json({ message: 'requestId debe ser un número positivo' });
    return;
  }

  if (
    !requirementInstanceId ||
    Number.isNaN(parsedRequirementInstanceId) ||
    parsedRequirementInstanceId <= 0
  ) {
    res.status(400).json({ message: 'requirementInstanceId debe ser un número positivo' });
    return;
  }

  const requestWithFile = req as RequestWithFile;

  if (!requestWithFile.file || !requestWithFile.file.path) {
    res.status(400).json({ message: 'El archivo es obligatorio' });
    return;
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    res.status(400).json({ message: 'userId es obligatorio' });
    return;
  }

  try {
    const item = await uploadRequirementFileForRequest(
      parsedRequestId,
      parsedRequirementInstanceId,
      userId,
      requestWithFile.file.path,
      parsedNextStatusId,
      typeof reviewReason === 'string' ? reviewReason : null
    );

    res.status(200).json({ data: item });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
