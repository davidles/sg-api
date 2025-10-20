import fs from 'fs';
import path from 'path';
import models from '../models';
import type { RequestRequirementInstanceAttributes } from '../types/requestRequirementInstance';
import type { RequirementAttributes } from '../types/requirement';
import type { RequirementInstanceStatusAttributes } from '../types/requirementInstanceStatus';
import type { RequestRequirementInstanceInstance } from '../models/requestRequirementInstance';

export interface RequestRequirementItem {
  requirementInstance: RequestRequirementInstanceAttributes;
  requirement: Pick<RequirementAttributes, 'idRequirement' | 'requirementName' | 'requirementDescription'> | null;
  status: Pick<
    RequirementInstanceStatusAttributes,
    'idRequirementInstanceStatus' | 'requirementInstanceStatusName'
  > | null;
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

  const normalizedFilters = statusFilters
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

  const absoluteUploadedPath = path.isAbsolute(uploadedFilePath)
    ? uploadedFilePath
    : path.resolve(process.cwd(), uploadedFilePath);

  ensureDirectory(path.dirname(absoluteUploadedPath));

  const complianceVersion = (instance.getDataValue('complianceVersion') ?? 0) + 1;
  const storageDate = new Date().toISOString().split('T')[0];

  await instance.update({
    completedByUserId: userId,
    completedAt: storageDate,
    currentRequirementStatusId: statusToApply ?? instance.getDataValue('currentRequirementStatusId'),
    complianceVersion,
    reviewReason: reviewReason ?? instance.getDataValue('reviewReason'),
    requirementFilePath: normalizeStoredPath(absoluteUploadedPath)
  });

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
    ]
  });

  return mapToItem(instance);
};
