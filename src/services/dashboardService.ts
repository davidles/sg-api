import models from '../models';
import type { RequestTypeInstance } from '../models/requestType';
import type { RequestInstance } from '../models/request';
import type { RequestStatusHistoryInstance } from '../models/requestStatusHistory';
import type { RequestStatusInstance } from '../models/requestStatus';
import { AppError } from '../utils/appError';
import type {
  DashboardData,
  DashboardMenuOption,
  DashboardRequestSummary
} from '../types/dashboard';

const mapMenuOption = (instance: RequestTypeInstance): DashboardMenuOption => {
  const plain = instance.get({ plain: true });

  return {
    id: plain.idRequestType,
    name: plain.requestTypeName ?? null,
    description: plain.requestTypeDescription ?? null
  };
};

const resolveLatestStatus = (
  statusHistory: RequestStatusHistoryInstance[]
): { statusName: string | null; statusDescription: string | null } => {
  if (statusHistory.length === 0) {
    return {
      statusName: null,
      statusDescription: null
    };
  }

  const sortedHistory = [...statusHistory].sort((a, b) => {
    const aDate = a.getDataValue('statusStartDate');
    const bDate = b.getDataValue('statusStartDate');

    if (!aDate && !bDate) {
      return 0;
    }

    if (!aDate) {
      return 1;
    }

    if (!bDate) {
      return -1;
    }

    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  const latestHistory = sortedHistory[0];
  const statusInstance = latestHistory.get('status') as RequestStatusInstance | null;

  if (!statusInstance) {
    return {
      statusName: null,
      statusDescription: null
    };
  }

  return {
    statusName: statusInstance.getDataValue('requestStatusName') ?? null,
    statusDescription: statusInstance.getDataValue('requestStatusDescription') ?? null
  };
};

const computeNextAction = (statusName: string | null): string => {
  if (!statusName) {
    return 'Ver detalle';
  }

  const normalized = statusName.toLowerCase();

  if (normalized.includes('pend')) {
    return 'Completar requisitos';
  }

  if (normalized.includes('observ')) {
    return 'Revisar observaciones';
  }

  if (normalized.includes('aprob')) {
    return 'Descargar constancia';
  }

  return 'Ver detalle';
};

const mapRequestSummary = (instance: RequestInstance): DashboardRequestSummary => {
  const mappedStatusHistory = (instance.get('statusHistory') as RequestStatusHistoryInstance[] | undefined) ?? [];
  const statusInfo = resolveLatestStatus(mappedStatusHistory);
  const requestType = instance.get('requestType') as RequestTypeInstance | null;

  return {
    idRequest: instance.getDataValue('idRequest'),
    requestTypeName: requestType?.getDataValue('requestTypeName') ?? null,
    generatedAt: instance.getDataValue('generatedAt') ?? null,
    statusName: statusInfo.statusName,
    statusDescription: statusInfo.statusDescription,
    nextAction: computeNextAction(statusInfo.statusName)
  };
};

export const getDashboardDataForUser = async (userId: number): Promise<DashboardData> => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError('El identificador de usuario es inválido', 400);
  }

  const user = await models.user.findByPk(userId);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const [requestTypes, requests] = await Promise.all([
    models.requestType.findAll({ order: [['requestTypeName', 'ASC']] }),
    models.request.findAll({
      where: { userId },
      include: [
        { model: models.requestType, as: 'requestType' },
        {
          model: models.requestStatusHistory,
          as: 'statusHistory',
          include: [{ model: models.requestStatus, as: 'status' }]
        }
      ],
      order: [['generatedAt', 'DESC']]
    })
  ]);

  const menuOptions = requestTypes.map(mapMenuOption);
  const requestSummaries = requests.map(mapRequestSummary);

  return {
    menuOptions,
    requests: requestSummaries
  };
};
