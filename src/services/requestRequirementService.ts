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
import type { RequestInstance } from '../models/request';
import type { RequirementInstance } from '../models/requirement';
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
  REQUEST_STATUS_TO_FIX_FALLBACK_NAMES,
  REQUEST_STATUS_IN_SG_NAME,
  REQUEST_STATUS_IN_SG_FALLBACK_NAMES,
  REQUEST_STATUS_IN_UNDEF_NAME,
  REQUEST_STATUS_IN_UNDEF_FALLBACK_NAMES,
  REQUEST_STATUS_DIPLOMA_IN_PROGRESS_NAME,
  REQUEST_STATUS_DIPLOMA_IN_PROGRESS_FALLBACK_NAMES,
  REQUEST_STATUS_READY_FOR_PICKUP_NAME,
  REQUEST_STATUS_READY_FOR_PICKUP_FALLBACK_NAMES,
  REQUEST_STATUS_FINALIZED_NAME,
  REQUEST_STATUS_FINALIZED_FALLBACK_NAMES
} from '../constants/status';
import { calculateRequestDeadline, calculateDaysRemaining } from '../utils/deadline';
import requirementResponsibilityMap, {
  RequirementResponsibility,
  findResponsibility,
  REMOVED_REQUIREMENT_IDS
} from '../utils/requirementResponsibility';

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
  responsibility?: RequirementResponsibility;
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
    where: { requestId, requirementId: { [Op.notIn]: REMOVED_REQUIREMENT_IDS } },
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

  const requestTypeId = (requestExists.getDataValue('requestTypeId') as number | null) ?? null;

  return filteredInstances.map((instance) => {
    const item = mapToItem(instance);
    const requirementId = item.requirement?.idRequirement ?? null;
    const responsibility = findResponsibility(
      requirementResponsibilityMap,
      requestTypeId,
      requirementId
    );

    return {
      ...item,
      responsibility: responsibility ?? RequirementResponsibility.GRADUATE
    };
  });
};

export const evaluateRequestStatus = async (
  requestId: number
): Promise<{
  requestId: number;
  requestStatusId: number | null;
  requestStatusName: string | null;
  totalGraduateRequirements: number;
  completedGraduateRequirements: number;
  acceptedGraduateRequirements: number;
  hasRejectedGraduateRequirements: boolean;
  deadlineDate: string | null;
  daysRemaining: number | null;
}> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  const request = await models.request.findByPk(requestId, {
    include: [
      {
        model: models.requestStatusHistory,
        as: 'statusHistory',
        include: [{ model: models.requestStatus, as: 'status' }]
      }
    ]
  });

  if (!request) {
    throw new Error('Solicitud no encontrada');
  }

  const statusHistory = (request.get('statusHistory') as any[]) ?? [];

  const latestStatus = statusHistory
    .slice()
    .sort((a, b) => (b.getDataValue('idHistorial') ?? 0) - (a.getDataValue('idHistorial') ?? 0))[0];

  const latestStatusInstance = latestStatus?.get('status') as RequestStatusInstance | null;

  const statusId = latestStatusInstance?.getDataValue('idRequestStatus') ?? null;
  const statusName = latestStatusInstance?.getDataValue('requestStatusName') ?? null;

  const requirements = await getRequirementsForRequest(requestId, undefined);

  const graduateRequirements = requirements.filter(
    (item) => item.responsibility === RequirementResponsibility.GRADUATE
  );

  const totalGraduateRequirements = graduateRequirements.length;

  let completedGraduateRequirements = 0;
  let acceptedGraduateRequirements = 0;
  let hasRejectedGraduateRequirements = false;

  for (const item of graduateRequirements) {
    const status = item.status?.requirementInstanceStatusName ?? '';
    const normalized = status.toLowerCase();

    if (!status) {
      continue;
    }

    const isCompleted =
      normalized === REQUIREMENT_STATUS_COMPLETED_NAME.toLowerCase() ||
      normalized === REQUIREMENT_STATUS_ACCEPTED_NAME.toLowerCase();

    const isAccepted = [
      REQUIREMENT_STATUS_ACCEPTED_NAME,
      ...REQUIREMENT_STATUS_ACCEPTED_FALLBACK_NAMES
    ]
      .map((value) => value.toLowerCase())
      .includes(normalized);

    const isRejected = [
      REQUIREMENT_STATUS_REJECTED_NAME,
      ...REQUIREMENT_STATUS_REJECTED_FALLBACK_NAMES
    ]
      .map((value) => value.toLowerCase())
      .includes(normalized);

    if (isCompleted) {
      completedGraduateRequirements += 1;
    }

    if (isAccepted) {
      acceptedGraduateRequirements += 1;
    }

    if (isRejected) {
      hasRejectedGraduateRequirements = true;
    }
  }

  const generatedAt = (request.getDataValue('generatedAt') as string | null) ?? null;
  const isFinalized = (statusName ?? '').toLowerCase() === REQUEST_STATUS_FINALIZED_NAME.toLowerCase();
  const deadlineDate = isFinalized ? null : calculateRequestDeadline(generatedAt);

  return {
    requestId,
    requestStatusId: statusId,
    requestStatusName: statusName,
    totalGraduateRequirements,
    completedGraduateRequirements,
    acceptedGraduateRequirements,
    hasRejectedGraduateRequirements,
    deadlineDate,
    daysRemaining: calculateDaysRemaining(deadlineDate)
  };
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
    order: [['idHistorial', 'DESC']],
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
    // También cubre el caso en que quien sube el archivo es la Facultad (ej. Certificado
    // Provisorio): si con esta carga ya completó todo lo que le corresponde, la solicitud
    // debe avanzar de "Aceptada por Facultad" a la siguiente etapa.
    await promoteRequestStatusAfterReview(instance.getDataValue('requestId'), transaction);
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

  // El nombre/extension originales viven en requirementFilePath aunque los bytes
  // se sirvan desde el BLOB de la base (que es el caso normal hoy en dia): sin esto,
  // toda descarga salia como "application/octet-stream" sin extension y el sistema
  // operativo no sabia abrirla como PDF/imagen.
  if (storedPath) {
    const extension = path.extname(storedPath).toLowerCase();
    mimeType = MIME_TYPES_BY_EXTENSION[extension] ?? mimeType;
    fileName = path.basename(storedPath);
  }

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

  const request = (await models.request.findByPk(parsedRequestId, {
    transaction: transactionToUse
  })) as RequestInstance | null;

  if (!request) {
    if (shouldManageTransaction) {
      await transactionToUse.rollback();
    }
    throw new Error('Solicitud no encontrada al intentar promover su estado.');
  }

  const requestTypeId = request.getDataValue('requestTypeId') ?? null;

  const allRequirementInstances = await models.requestRequirementInstance.findAll({
    where: { requestId: parsedRequestId, requirementId: { [Op.notIn]: REMOVED_REQUIREMENT_IDS } },
    include: [
      {
        model: models.requirement,
        as: 'requirement'
      }
    ],
    transaction: transactionToUse
  });

  const graduateRequirementInstances = allRequirementInstances.filter((instance) => {
    const requirementId = instance.getDataValue('requirementId') ?? null;
    const responsibility = findResponsibility(
      requirementResponsibilityMap,
      requestTypeId,
      requirementId
    );

    return responsibility === RequirementResponsibility.GRADUATE;
  });

  const hasPendingGraduateRequirement = graduateRequirementInstances.some((instance) => {
    const statusId = instance.getDataValue('currentRequirementStatusId');

    if (statusId === null || statusId === undefined) {
      return true;
    }

    return statusId !== REQUIREMENT_STATUS_COMPLETED_ID;
  });

  if (hasPendingGraduateRequirement) {
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
    return;
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
        requestId: parsedRequestId,
        requirementId: { [Op.notIn]: REMOVED_REQUIREMENT_IDS }
      },
      include: [
        {
          model: models.requirement,
          as: 'requirement'
        }
      ],
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

    const request = (await models.request.findByPk(parsedRequestId, {
      transaction: transactionToUse
    })) as RequestInstance | null;

    if (!request) {
      throw new Error('Solicitud no encontrada al evaluar su estado después de la revisión.');
    }

    const requestTypeId = request.getDataValue('requestTypeId') ?? null;

    const graduateRequirementInstances = requirementInstances.filter((instance) => {
      const requirementId = instance.getDataValue('requirementId') ?? null;
      const responsibility = findResponsibility(
        requirementResponsibilityMap,
        requestTypeId,
        requirementId
      );

      return responsibility === RequirementResponsibility.GRADUATE;
    });

    // Para un grupo de responsabilidad dado (Facultad, Secretaria General, ...) devuelve
    // solo las instancias que son obligatorias segun el catalogo: las opcionales (ej.
    // equivalencias) nunca deben bloquear el avance del tramite, aunque queden "Incompleto".
    const filterRequiredInstances = async (
      responsibility: RequirementResponsibility
    ): Promise<RequestRequirementInstanceInstance[]> => {
      const instancesForResponsibility = requirementInstances.filter((instance) => {
        const requirementId = instance.getDataValue('requirementId') ?? null;
        return (
          findResponsibility(requirementResponsibilityMap, requestTypeId, requirementId) ===
          responsibility
        );
      });

      const requirementIds = instancesForResponsibility
        .map((instance) => instance.getDataValue('requirementId'))
        .filter((id): id is number => id !== null && id !== undefined);

      const requiredLinks =
        requirementIds.length && requestTypeId !== null
          ? await models.requestTypeRequirement.findAll({
              where: {
                requestTypeId,
                requirementId: { [Op.in]: requirementIds },
                isRequired: 1
              },
              transaction: transactionToUse
            })
          : [];

      const requiredRequirementIds = new Set(
        requiredLinks.map((link) => link.getDataValue('requirementId'))
      );

      return instancesForResponsibility.filter((instance) => {
        const requirementId = instance.getDataValue('requirementId');
        return requirementId !== null && requiredRequirementIds.has(requirementId);
      });
    };

    // "Completo" o "Aceptado" cuentan igual aca: ambos significan que el archivo ya
    // fue cargado. Una vez aceptado, el estado deja de ser literalmente "Completo",
    // pero seria un error que eso hiciera retroceder el tramite.
    const allCompleted = (instances: RequestRequirementInstanceInstance[]): boolean =>
      instances.every((instance) => {
        const statusId = instance.getDataValue('currentRequirementStatusId');
        return statusId === REQUIREMENT_STATUS_COMPLETED_ID || statusId === acceptedId;
      });

    const allAccepted = (instances: RequestRequirementInstanceInstance[]): boolean =>
      instances.every((instance) => instance.getDataValue('currentRequirementStatusId') === acceptedId);

    const requiredFacultyInstances = await filterRequiredInstances(RequirementResponsibility.FACULTY);
    const requiredSecretariaGeneralInstances = await filterRequiredInstances(
      RequirementResponsibility.SECRETARIA_GENERAL
    );

    const allRequiredFacultyCompleted = allCompleted(requiredFacultyInstances);
    const allRequiredSecretariaGeneralCompleted = allCompleted(requiredSecretariaGeneralInstances);
    // UNDEF valida (acepta) tanto lo que subio Facultad como lo que subio Secretaria
    // General; recien ahi el diploma pasa a confeccionarse.
    const allRequiredFacultyAccepted = allAccepted(requiredFacultyInstances);
    const allRequiredSecretariaGeneralAccepted = allAccepted(requiredSecretariaGeneralInstances);

    const hasRejectedGraduate = graduateRequirementInstances.some((instance) => {
      const statusId = instance.getDataValue('currentRequirementStatusId');
      return statusId === rejectedId;
    });

    const allGraduateAccepted =
      graduateRequirementInstances.length > 0 &&
      graduateRequirementInstances.every((instance) => {
        const statusId = instance.getDataValue('currentRequirementStatusId');
        return statusId === acceptedId;
      });

    if (!hasRejectedGraduate && allGraduateAccepted) {
      let targetStatusNames: string[] | null = null;

      if (!allRequiredFacultyCompleted) {
        targetStatusNames = REQUEST_ACCEPTED_BY_FACULTY_NAMES;
      } else if (!allRequiredSecretariaGeneralCompleted) {
        targetStatusNames = [REQUEST_STATUS_IN_SG_NAME, ...REQUEST_STATUS_IN_SG_FALLBACK_NAMES];
      } else if (!allRequiredFacultyAccepted || !allRequiredSecretariaGeneralAccepted) {
        targetStatusNames = [REQUEST_STATUS_IN_UNDEF_NAME, ...REQUEST_STATUS_IN_UNDEF_FALLBACK_NAMES];
      } else {
        targetStatusNames = [
          REQUEST_STATUS_DIPLOMA_IN_PROGRESS_NAME,
          ...REQUEST_STATUS_DIPLOMA_IN_PROGRESS_FALLBACK_NAMES
        ];
      }

      const targetStatus = await findRequestStatusByNames(targetStatusNames);

      if (targetStatus) {
        await ensureRequestStatus(parsedRequestId, targetStatus, transactionToUse);
      }
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

  let targetStatus: RequirementInstanceStatusInstance | null = null;

  if (nextStatusId === 3) {
    targetStatus = await findRequirementStatusByNames(REQUIREMENT_ACCEPTED_NAMES);
  } else if (nextStatusId === 4) {
    targetStatus = await findRequirementStatusByNames(REQUIREMENT_REJECTED_NAMES);
  } else {
    targetStatus = await models.requirementInstanceStatus.findByPk(nextStatusId);
  }

  if (!targetStatus) {
    throw new Error('El estado de requisito indicado no existe');
  }

  const targetStatusName = targetStatus.getDataValue('requirementInstanceStatusName') ?? '';
  const normalizedTarget = targetStatusName.toLowerCase();

  const isAccepted = REQUIREMENT_ACCEPTED_NAMES.map((name) => name.toLowerCase()).includes(normalizedTarget);
  const isRejected = REQUIREMENT_REJECTED_NAMES.map((name) => name.toLowerCase()).includes(normalizedTarget);

  // En esta iteración permitimos cualquier estado de requisito válido; isAccepted/isRejected
  // se usan solo para la lógica interna de promoción de la solicitud.

  await sequelize.transaction(async (transaction) => {
    const reviewDate = new Date().toISOString();

    const previousFilePath = instance.getDataValue('requirementFilePath');

    if (isRejected && previousFilePath) {
      const absolutePreviousPath = path.isAbsolute(previousFilePath)
        ? previousFilePath
        : path.resolve(process.cwd(), previousFilePath);

      try {
        if (fs.existsSync(absolutePreviousPath)) {
          fs.unlinkSync(absolutePreviousPath);
        }
      } catch (error) {}
    }

    await instance.update(
      {
        verifiedByUserId: reviewerUserId,
        verifiedAt: reviewDate,
        currentRequirementStatusId: nextStatusId,
        reviewReason: typeof reviewReason === 'string' ? reviewReason : null,
        requirementFilePath: isRejected ? null : instance.getDataValue('requirementFilePath'),
        fileBlob: isRejected ? null : instance.getDataValue('fileBlob')
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

const getLatestRequestStatusName = async (
  requestId: number,
  transaction?: Transaction
): Promise<string | null> => {
  const latestHistory = await models.requestStatusHistory.findOne({
    where: { requestId },
    order: [['idHistorial', 'DESC']],
    include: [{ model: models.requestStatus, as: 'status' }],
    transaction
  });

  const status = latestHistory?.get('status') as RequestStatusInstance | undefined;
  return status?.getDataValue('requestStatusName') ?? null;
};

const namesMatch = (name: string | null, candidates: string[]): boolean =>
  name !== null && candidates.map((value) => value.toLowerCase()).includes(name.toLowerCase());

// Estos dos pasos no dependen de ningun requisito documental: son la confeccion fisica
// del diploma y su entrega, marcadas a mano por UNDEF.
export const markDiplomaReadyForPickup = async (requestId: number): Promise<void> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  await sequelize.transaction(async (transaction) => {
    const currentStatusName = await getLatestRequestStatusName(requestId, transaction);

    if (
      !namesMatch(currentStatusName, [
        REQUEST_STATUS_DIPLOMA_IN_PROGRESS_NAME,
        ...REQUEST_STATUS_DIPLOMA_IN_PROGRESS_FALLBACK_NAMES
      ])
    ) {
      throw new Error(
        'La solicitud debe estar "En Confección de Diploma" para marcarla como pendiente de retiro.'
      );
    }

    const targetStatus = await findRequestStatusByNames([
      REQUEST_STATUS_READY_FOR_PICKUP_NAME,
      ...REQUEST_STATUS_READY_FOR_PICKUP_FALLBACK_NAMES
    ]);

    if (!targetStatus) {
      throw new Error('No se encontró el estado "Pendiente de Retiro". Verificá la configuración de datos.');
    }

    await ensureRequestStatus(requestId, targetStatus, transaction);
  });
};

export const markDiplomaDelivered = async (requestId: number): Promise<void> => {
  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new Error('requestId debe ser un número positivo');
  }

  await sequelize.transaction(async (transaction) => {
    const currentStatusName = await getLatestRequestStatusName(requestId, transaction);

    if (
      !namesMatch(currentStatusName, [
        REQUEST_STATUS_READY_FOR_PICKUP_NAME,
        ...REQUEST_STATUS_READY_FOR_PICKUP_FALLBACK_NAMES
      ])
    ) {
      throw new Error('La solicitud debe estar "Pendiente de Retiro" para marcarla como finalizada.');
    }

    const targetStatus = await findRequestStatusByNames([
      REQUEST_STATUS_FINALIZED_NAME,
      ...REQUEST_STATUS_FINALIZED_FALLBACK_NAMES
    ]);

    if (!targetStatus) {
      throw new Error('No se encontró el estado "Finalizada". Verificá la configuración de datos.');
    }

    await ensureRequestStatus(requestId, targetStatus, transaction);
  });
};
