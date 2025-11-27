import fs from 'fs';
import path from 'path';
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import models from '../models';
import type { RequestRequirementInstanceAttributes } from '../types/requestRequirementInstance';
import type { RequirementAttributes } from '../types/requirement';
import type { RequirementInstanceStatusAttributes } from '../types/requirementInstanceStatus';
import type { RequestRequirementInstanceInstance } from '../models/requestRequirementInstance';
import type { RequirementInstanceStatusInstance } from '../models/requirementInstanceStatus';
import type { RequestStatusInstance } from '../models/requestStatus';
import {
  REQUIREMENT_STATUS_COMPLETED_ID,
  REQUIREMENT_STATUS_COMPLETED_NAME,
  REQUIREMENT_STATUS_ACCEPTED_NAME,
  REQUIREMENT_STATUS_ACCEPTED_FALLBACK_NAMES,
  REQUIREMENT_STATUS_REJECTED_NAME,
  REQUIREMENT_STATUS_REJECTED_FALLBACK_NAMES,
  REQUEST_STATUS_IN_FACULTY_NAME,
  REQUEST_STATUS_IN_FACULTY_FALLBACK_NAMES,
  REQUEST_STATUS_ACCEPTED_BY_FACULTY_NAME,
  REQUEST_STATUS_ACCEPTED_BY_FACULTY_FALLBACK_NAMES,
  REQUEST_STATUS_TO_FIX_NAME,
  REQUEST_STATUS_TO_FIX_FALLBACK_NAMES
} from '../constants/status';

const ALLOWED_REQUIREMENT_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const MIME_TYPES_BY_EXTENSION: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const REQUIREMENT_ACCEPTED_NAMES = [
  REQUIREMENT_STATUS_ACCEPTED_NAME,
  ...REQUIREMENT_STATUS_ACCEPTED_FALLBACK_NAMES
];

const REQUIREMENT_REJECTED_NAMES = [
  REQUIREMENT_STATUS_REJECTED_NAME,
  ...REQUIREMENT_STATUS_REJECTED_FALLBACK_NAMES
];

const REQUEST_ACCEPTED_BY_FACULTY_NAMES = [
  REQUEST_STATUS_ACCEPTED_BY_FACULTY_NAME,
  ...REQUEST_STATUS_ACCEPTED_BY_FACULTY_FALLBACK_NAMES
];

const REQUEST_TO_FIX_NAMES = [REQUEST_STATUS_TO_FIX_NAME, ...REQUEST_STATUS_TO_FIX_FALLBACK_NAMES];

export interface RequestRequirementItem {
  requirementInstance: RequestRequirementInstanceAttributes;
  requirement: Pick<RequirementAttributes, 'idRequirement' | 'requirementName' | 'requirementDescription'> | null;
  status: Pick<
    RequirementInstanceStatusAttributes,
    'idRequirementInstanceStatus' | 'requirementInstanceStatusName'
  > | null;
}

export interface RequirementFilePayload {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}

export const getRequirementsForRequest = async (
  requestId: number,
  statusFilters: string[] | undefined
): Promise<RequestRequirementItem[]> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  const requestExists = await models.request.findByPk(requestId);

  if (!requestExists) {
    throw new Error('Solicitud no encontrada');
  }

  const instances = await models.requestRequirementInstance.findAll({
    where: { requestId },
    include: [
      {
        model: models.requirement,
        as: 'requirement',
        attributes: ['idRequirement', 'requirementName', 'requirementDescription']
      },
      {
        model: models.requirementInstanceStatus,
        as: 'status',
        attributes: ['idRequirementInstanceStatus', 'requirementInstanceStatusName']
      }
    ],
    order: [['idRequestRequirementInstance', 'ASC']]
  });

  const normalizedFilters =
    statusFilters
      ?.map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((value) => value.toLowerCase()) ?? [];

  const filteredInstances =
    normalizedFilters.length > 0
      ? instances.filter((instance) => {
          const plain = instance.get({ plain: true }) as RequestRequirementInstanceAttributes & {
            status?: RequirementInstanceStatusAttributes | null;
          };
          const statusName = plain.status?.requirementInstanceStatusName?.toLowerCase() ?? '';
          return normalizedFilters.includes(statusName);
        })
      : instances;

  return filteredInstances.map(mapToItem);
};

const ensureDirectory = (directoryPath: string): void => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const normalizeStoredPath = (absolutePath: string): string => {
  const relativePath = path.relative(process.cwd(), absolutePath);
  return relativePath.split(path.sep).join('/');
};

const mapToItem = (instance: RequestRequirementInstanceInstance): RequestRequirementItem => {
  const plain = instance.get({ plain: true }) as RequestRequirementInstanceAttributes & {
    requirement?: RequirementAttributes | null;
    status?: RequirementInstanceStatusAttributes | null;
  };

  return {
    requirementInstance: plain,
    requirement: plain.requirement
      ? {
          idRequirement: plain.requirement.idRequirement,
          requirementName: plain.requirement.requirementName,
          requirementDescription: plain.requirement.requirementDescription
        }
      : null,
    status: plain.status
      ? {
          idRequirementInstanceStatus: plain.status.idRequirementInstanceStatus,
          requirementInstanceStatusName: plain.status.requirementInstanceStatusName
        }
      : null
  };
};

const findRequirementStatusByNames = async (
  statusNames: string[]
): Promise<RequirementInstanceStatusInstance | null> => {
  return models.requirementInstanceStatus.findOne({
    where: {
      requirementInstanceStatusName: {
        [Op.in]: statusNames
      }
    }
  });
};

const findRequestStatusByNames = async (statusNames: string[]): Promise<RequestStatusInstance | null> => {
  return models.requestStatus.findOne({
    where: {
      requestStatusName: {
        [Op.in]: statusNames
      }
    }
  });
};

const ensureRequestStatus = async (
  requestId: number,
  targetStatus: RequestStatusInstance,
  transaction: Transaction
): Promise<void> => {
  const targetStatusId = targetStatus.getDataValue('idRequestStatus');
  const latestHistory = await models.requestStatusHistory.findOne({
    where: {
      requestId
    },
    order: [['statusStartDate', 'DESC']],
    transaction
  });

  const nowIso = new Date().toISOString();

  if (latestHistory) {
    const latestStatusId = latestHistory.getDataValue('requestStatusId');
    const hasOpenHistory = !latestHistory.getDataValue('statusEndDate');

    if (latestStatusId === targetStatusId) {
      if (!hasOpenHistory) {
        return;
      }

      return;
    }

    if (hasOpenHistory) {
      await latestHistory.update(
        {
          statusEndDate: nowIso
        },
        { transaction }
      );
    }
  }

  await models.requestStatusHistory.create(
    {
      requestId,
      requestStatusId: targetStatusId,
      statusStartDate: nowIso,
      statusEndDate: null
    },
    { transaction }
  );
};

const validateUploadedFile = (filePath: string): { absolutePath: string; extension: string; mimeType: string } => {
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error('El archivo temporal no existe. Intentá nuevamente la carga.');
  }

  const fileStats = fs.statSync(absolutePath);

  if (fileStats.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo supera el tamaño máximo permitido (10 MB).');
  }

  const extension = path.extname(absolutePath).toLowerCase();

  if (!ALLOWED_REQUIREMENT_EXTENSIONS.has(extension)) {
    throw new Error('El formato de archivo no es válido. Permitidos: PDF, JPG, JPEG, PNG.');
  }

  const mimeType = MIME_TYPES_BY_EXTENSION[extension];

  if (!mimeType) {
    throw new Error('No se pudo determinar el tipo de archivo.');
  }

  return { absolutePath, extension, mimeType };
};

export const uploadRequirementFileForRequest = async (
  requestId: number,
  requirementInstanceId: number,
  userId: number,
  uploadedFilePath: string,
  nextStatusId?: number | null,
  reviewReason?: string | null
): Promise<RequestRequirementItem> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  if (!Number.isInteger(requirementInstanceId) || requirementInstanceId <= 0) {
    throw new Error('requirementInstanceId debe ser un número positivo');
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('userId debe ser un número positivo');
  }

  const instance = await models.requestRequirementInstance.findOne({
    where: {
      idRequestRequirementInstance: requirementInstanceId,
      requestId
    },
    include: [
      {
        model: models.requirement,
        as: 'requirement',
        attributes: ['idRequirement', 'requirementName', 'requirementDescription']
      },
      {
        model: models.requirementInstanceStatus,
        as: 'status',
        attributes: ['idRequirementInstanceStatus', 'requirementInstanceStatusName']
      }
    ]
  });

  if (!instance) {
    throw new Error('No se encontró el requisito para la solicitud indicada');
  }

  let statusToApply: number | null | undefined = nextStatusId ?? undefined;

  if (typeof nextStatusId === 'number') {
    const status = await models.requirementInstanceStatus.findByPk(nextStatusId);

    if (!status) {
      throw new Error('El estado de requisito indicado no existe');
    }

    statusToApply = status.getDataValue('idRequirementInstanceStatus');
  }

  await sequelize.transaction(async (transaction) => {
    const previousFilePath = instance.getDataValue('requirementFilePath');

    if (previousFilePath) {
      const absolutePrevious = path.isAbsolute(previousFilePath)
        ? previousFilePath
        : path.resolve(process.cwd(), previousFilePath);

      try {
        if (fs.existsSync(absolutePrevious)) {
          fs.unlinkSync(absolutePrevious);
        }
      } catch (error) {
        // Ignorar errores al eliminar archivos antiguos para no bloquear la carga.
      }
    }

    const { absolutePath: absoluteUploadedPath } = validateUploadedFile(uploadedFilePath);

    ensureDirectory(path.dirname(absoluteUploadedPath));

    let fileBuffer: Buffer | null = null;

    try {
      fileBuffer = fs.readFileSync(absoluteUploadedPath);
    } catch (error) {
      fileBuffer = null;
    }

    const previousVersion = instance.getDataValue('completionVersion');
    const completionVersion = (typeof previousVersion === 'number' ? previousVersion : 0) + 1;
    const storageDate = new Date().toISOString();

    const statusIdToPersist =
      typeof statusToApply === 'number' ? statusToApply : REQUIREMENT_STATUS_COMPLETED_ID;

    await instance.update(
      {
        completedByUserId: userId,
        completedAt: storageDate,
        currentRequirementStatusId: statusIdToPersist,
        completionVersion,
        reviewReason: reviewReason ?? instance.getDataValue('reviewReason'),
        requirementFilePath: normalizeStoredPath(absoluteUploadedPath),
        fileBlob: fileBuffer
      },
      { transaction }
    );

    await instance.reload({
      include: [
        {
          model: models.requirement,
          as: 'requirement',
          attributes: ['idRequirement', 'requirementName', 'requirementDescription']
        },
        {
          model: models.requirementInstanceStatus,
          as: 'status',
          attributes: ['idRequirementInstanceStatus', 'requirementInstanceStatusName']
        }
      ],
      transaction
    });

    await promoteRequestStatusIfRequirementsCompleted(instance.getDataValue('requestId'), transaction);
  });

  return mapToItem(instance);
};

export const getRequirementFileForRequest = async (
  requestId: number,
  requirementInstanceId: number
): Promise<RequirementFilePayload> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  if (!Number.isInteger(requirementInstanceId) || requirementInstanceId <= 0) {
    throw new Error('requirementInstanceId debe ser un número positivo');
  }

  const instance = await models.requestRequirementInstance.findOne({
    where: {
      idRequestRequirementInstance: requirementInstanceId,
      requestId
    }
  });

  if (!instance) {
    throw new Error('No se encontró el requisito para la solicitud indicada');
  }

  const storedPath = instance.getDataValue('requirementFilePath');
  const storedBuffer = instance.getDataValue('fileBlob') as Buffer | null;

  if (!storedPath && !storedBuffer) {
    throw new Error('La instancia del requisito no tiene un archivo cargado todavía.');
  }

  let buffer: Buffer;
  let fileName = `requisito_${requirementInstanceId}`;
  let mimeType = 'application/octet-stream';

  if (storedBuffer && storedBuffer.length > 0) {
    buffer = storedBuffer;
  } else if (storedPath) {
    const absolutePath = path.isAbsolute(storedPath)
      ? storedPath
      : path.resolve(process.cwd(), storedPath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error('El archivo asociado al requisito no está disponible.');
    }

    buffer = fs.readFileSync(absolutePath);
    const extension = path.extname(absolutePath).toLowerCase();
    mimeType = MIME_TYPES_BY_EXTENSION[extension] ?? mimeType;
    fileName = path.basename(absolutePath);
  } else {
    throw new Error('No se pudo recuperar el archivo del requisito.');
  }

  return {
    fileName,
    mimeType,
    buffer
  };
};

const promoteRequestStatusIfRequirementsCompleted = async (
  requestId: number | null | undefined,
  transaction?: Transaction
): Promise<void> => {
  if (!Number.isInteger(requestId) || (requestId as number) <= 0) {
    return;
  }

  const parsedRequestId = Number(requestId);

  const transactionToUse = transaction ?? (await sequelize.transaction());
  const shouldManageTransaction = !transaction;

  const pendingRequirements = await models.requestRequirementInstance.count({
    where: {
      requestId: parsedRequestId,
      [Op.or]: [
        { currentRequirementStatusId: null },
        {
          currentRequirementStatusId: {
            [Op.ne]: REQUIREMENT_STATUS_COMPLETED_ID
          }
        }
      ]
    },
    transaction: transactionToUse
  });

  if (pendingRequirements > 0) {
    if (shouldManageTransaction) {
      await transactionToUse.rollback();
    }
    return;
  }

  const targetStatus = await findRequestStatusByNames([
    REQUEST_STATUS_IN_FACULTY_NAME,
    ...REQUEST_STATUS_IN_FACULTY_FALLBACK_NAMES
  ]);

  if (!targetStatus) {
    if (shouldManageTransaction) {
      await transactionToUse.rollback();
    }
    throw new Error(
      `No se encontró el estado de solicitud "${REQUEST_STATUS_IN_FACULTY_NAME}". Verificá la configuración de datos.`
    );
  }

  try {
    await ensureRequestStatus(parsedRequestId, targetStatus, transactionToUse);

    if (shouldManageTransaction) {
      await transactionToUse.commit();
    }
  } catch (error) {
    if (shouldManageTransaction) {
      await transactionToUse.rollback();
    }
    throw error;
  }
};

const promoteRequestStatusAfterReview = async (
  requestId: number | null | undefined,
  transaction?: Transaction
): Promise<void> => {
  if (!Number.isInteger(requestId) || (requestId as number) <= 0) {
    return;
  }

  const parsedRequestId = Number(requestId);

  const transactionToUse = transaction ?? (await sequelize.transaction());
  const shouldManageTransaction = !transaction;

  try {
    const requirementInstances = await models.requestRequirementInstance.findAll({
      where: {
        requestId: parsedRequestId
      },
      attributes: ['currentRequirementStatusId'],
      transaction: transactionToUse
    });

    if (requirementInstances.length === 0) {
      if (shouldManageTransaction) {
        await transactionToUse.commit();
      }
      return;
    }

    const acceptedStatus = await findRequirementStatusByNames(REQUIREMENT_ACCEPTED_NAMES);
    const rejectedStatus = await findRequirementStatusByNames(REQUIREMENT_REJECTED_NAMES);

    if (!acceptedStatus || !rejectedStatus) {
      throw new Error(
        'No se encontraron los estados de requisito para revisión. Verificá la configuración de datos.'
      );
    }

    const acceptedId = acceptedStatus.getDataValue('idRequirementInstanceStatus');
    const rejectedId = rejectedStatus.getDataValue('idRequirementInstanceStatus');

    const hasRejected = requirementInstances.some((instance) => {
      const statusId = instance.getDataValue('currentRequirementStatusId');
      return statusId === rejectedId;
    });

    const allAccepted = requirementInstances.every((instance) => {
      const statusId = instance.getDataValue('currentRequirementStatusId');
      return statusId === acceptedId;
    });

    if (hasRejected) {
      const toFixStatus = await findRequestStatusByNames(REQUEST_TO_FIX_NAMES);

      if (!toFixStatus) {
        throw new Error(
          `No se encontró el estado de solicitud "${REQUEST_STATUS_TO_FIX_NAME}". Verificá la configuración de datos.`
        );
      }

      await ensureRequestStatus(parsedRequestId, toFixStatus, transactionToUse);
    } else if (allAccepted) {
      const acceptedByFacultyStatus = await findRequestStatusByNames(REQUEST_ACCEPTED_BY_FACULTY_NAMES);

      if (!acceptedByFacultyStatus) {
        throw new Error(
          `No se encontró el estado de solicitud "${REQUEST_STATUS_ACCEPTED_BY_FACULTY_NAME}". Verificá la configuración de datos.`
        );
      }

      await ensureRequestStatus(parsedRequestId, acceptedByFacultyStatus, transactionToUse);
    }

    if (shouldManageTransaction) {
      await transactionToUse.commit();
    }
  } catch (error) {
    if (shouldManageTransaction) {
      await transactionToUse.rollback();
    }
    throw error;
  }
};

export const reviewRequirementForRequest = async (
  requestId: number,
  requirementInstanceId: number,
  reviewerUserId: number,
  nextStatusId: number,
  reviewReason?: string | null
): Promise<RequestRequirementItem> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  if (!Number.isInteger(requirementInstanceId) || requirementInstanceId <= 0) {
    throw new Error('requirementInstanceId debe ser un número positivo');
  }

  if (!Number.isInteger(reviewerUserId) || reviewerUserId <= 0) {
    throw new Error('reviewerUserId debe ser un número positivo');
  }

  if (!Number.isInteger(nextStatusId) || nextStatusId <= 0) {
    throw new Error('nextStatusId debe ser un número positivo');
  }

  const instance = await models.requestRequirementInstance.findOne({
    where: {
      idRequestRequirementInstance: requirementInstanceId,
      requestId
    },
    include: [
      {
        model: models.requirement,
        as: 'requirement',
        attributes: ['idRequirement', 'requirementName', 'requirementDescription']
      },
      {
        model: models.requirementInstanceStatus,
        as: 'status',
        attributes: ['idRequirementInstanceStatus', 'requirementInstanceStatusName']
      }
    ]
  });

  if (!instance) {
    throw new Error('No se encontró el requisito para la solicitud indicada');
  }

  const targetStatus = await models.requirementInstanceStatus.findByPk(nextStatusId);

  if (!targetStatus) {
    throw new Error('El estado de requisito indicado no existe');
  }

  const targetStatusName = targetStatus.getDataValue('requirementInstanceStatusName') ?? '';
  const normalizedTarget = targetStatusName.toLowerCase();

  const isAccepted = REQUIREMENT_ACCEPTED_NAMES.map((name) => name.toLowerCase()).includes(normalizedTarget);
  const isRejected = REQUIREMENT_REJECTED_NAMES.map((name) => name.toLowerCase()).includes(normalizedTarget);

  if (!isAccepted && !isRejected) {
    throw new Error('Solo se permiten estados de revisión aceptado o rechazado');
  }

  await sequelize.transaction(async (transaction) => {
    const reviewDate = new Date().toISOString();

    await instance.update(
      {
        verifiedByUserId: reviewerUserId,
        verifiedAt: reviewDate,
        currentRequirementStatusId: nextStatusId,
        reviewReason: typeof reviewReason === 'string' ? reviewReason : null
      },
      { transaction }
    );

    await instance.reload({
      include: [
        {
          model: models.requirement,
          as: 'requirement',
          attributes: ['idRequirement', 'requirementName', 'requirementDescription']
        },
        {
          model: models.requirementInstanceStatus,
          as: 'status',
          attributes: ['idRequirementInstanceStatus', 'requirementInstanceStatusName']
        }
      ],
      transaction
    });

    await promoteRequestStatusAfterReview(instance.getDataValue('requestId'), transaction);
  });

  return mapToItem(instance);
};
