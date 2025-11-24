import models from '../models';
import type { RequestTypeInstance } from '../models/requestType';
import type { RequestInstance } from '../models/request';
import type { RequestRequirementInstanceInstance } from '../models/requestRequirementInstance';
import type { RequirementInstanceStatusInstance } from '../models/requirementInstanceStatus';
import type { RequestStatusHistoryInstance } from '../models/requestStatusHistory';
import type { RequestStatusInstance } from '../models/requestStatus';
import type { TitleInstance } from '../models/title';
import type { StudyPlanInstance } from '../models/studyPlan';
import type { AcademicProgramInstance } from '../models/academicProgram';
import type { FacultyInstance } from '../models/faculty';
import { AppError } from '../utils/appError';
import type {
  DashboardData,
  DashboardMenuOption,
  DashboardRequestSummary
} from '../types/dashboard';
import { REQUIREMENT_STATUS_COMPLETED_ID } from '../constants/status';

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
  const title = instance.get('title') as TitleInstance | null;
  const studyPlan = title?.get('studyPlan') as StudyPlanInstance | null;
  const academicProgram = studyPlan?.get('academicProgram') as AcademicProgramInstance | null;
  const faculty = academicProgram?.get('faculty') as FacultyInstance | null;
  const requirementInstances =
    (instance.get('requirementInstances') as RequestRequirementInstanceInstance[] | undefined) ?? [];

  const totalRequirements = requirementInstances.length;
  const completedRequirements = requirementInstances.filter((requirementInstance) => {
    const statusId = requirementInstance.getDataValue('currentRequirementStatusId');

    if (typeof statusId === 'number') {
      return statusId === REQUIREMENT_STATUS_COMPLETED_ID;
    }

    const statusInstance = requirementInstance.get('status') as RequirementInstanceStatusInstance | null;
    return statusInstance?.getDataValue('idRequirementInstanceStatus') === REQUIREMENT_STATUS_COMPLETED_ID;
  }).length;

  return {
    idRequest: instance.getDataValue('idRequest'),
    requestTypeName: requestType?.getDataValue('requestTypeName') ?? null,
    generatedAt: instance.getDataValue('generatedAt') ?? null,
    statusName: statusInfo.statusName,
    statusDescription: statusInfo.statusDescription,
    nextAction: computeNextAction(statusInfo.statusName),
    requestTypeId: requestType?.getDataValue('idRequestType') ?? instance.getDataValue('requestTypeId') ?? null,
    academicProgramName: academicProgram?.getDataValue('academicProgramName') ?? null,
    facultyName: faculty?.getDataValue('facultyName') ?? null,
    planName: studyPlan?.getDataValue('studyPlanName') ?? null,
    totalRequirements,
    completedRequirements
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

  const requestTypes = await models.requestType.findAll({ order: [['requestTypeName', 'ASC']] });

  let requests: RequestInstance[] = [];

  try {
    requests = await models.request.findAll({
      where: { userId },
      include: [
        { model: models.requestType, as: 'requestType' },
        {
          model: models.title,
          as: 'title',
          include: [
            {
              model: models.studyPlan,
              as: 'studyPlan',
              include: [
                {
                  model: models.academicProgram,
                  as: 'academicProgram',
                  include: [{ model: models.faculty, as: 'faculty' }]
                }
              ]
            }
          ]
        },
        {
          model: models.requestStatusHistory,
          as: 'statusHistory',
          include: [{ model: models.requestStatus, as: 'status' }]
        },
        {
          model: models.requestRequirementInstance,
          as: 'requirementInstances',
          include: [{ model: models.requirementInstanceStatus, as: 'status' }]
        }
      ],
      order: [['generatedAt', 'DESC']]
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('requeststatushistory')) {
      requests = await models.request.findAll({
        where: { userId },
        include: [
          { model: models.requestType, as: 'requestType' },
          {
            model: models.title,
            as: 'title',
            include: [
              {
                model: models.studyPlan,
                as: 'studyPlan',
                include: [
                  {
                    model: models.academicProgram,
                    as: 'academicProgram',
                    include: [{ model: models.faculty, as: 'faculty' }]
                  }
                ]
              }
            ]
          }
        ],
        order: [['generatedAt', 'DESC']]
      });
    } else {
      throw error;
    }
  }

  const menuOptions = requestTypes.map(mapMenuOption);
  const requestSummaries = requests.map(mapRequestSummary);

  return {
    menuOptions,
    requests: requestSummaries
  };
};
