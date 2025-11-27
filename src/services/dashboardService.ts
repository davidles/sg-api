import models from '../models';
import type { RequestTypeInstance } from '../models/requestType';
import type { RequestInstance } from '../models/request';
import type { RequestRequirementInstanceInstance } from '../models/requestRequirementInstance';
import type { RequirementInstanceStatusInstance } from '../models/requirementInstanceStatus';
import type { RequirementInstance } from '../models/requirement';
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
  DashboardRequestSummary,
  DashboardRequirementSummary
} from '../types/dashboard';
import {
  REQUIREMENT_STATUS_COMPLETED_ID,
  REQUIREMENT_STATUS_ACCEPTED_NAME,
  REQUIREMENT_STATUS_ACCEPTED_FALLBACK_NAMES,
  REQUEST_STATUS_IN_FACULTY_NAME,
  REQUEST_STATUS_IN_FACULTY_FALLBACK_NAMES
} from '../constants/status';
import { mapRoleId, isAdministrativeRole } from '../utils/role';
import requirementResponsibilityMap, {
  RequirementResponsibility,
  findResponsibility
} from '../utils/requirementResponsibility';

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

const mapRequestSummary = (
  instance: RequestInstance,
  requirementSummaries: DashboardRequirementSummary[]
): DashboardRequestSummary => {
  const mappedStatusHistory = (instance.get('statusHistory') as RequestStatusHistoryInstance[] | undefined) ?? [];
  const statusInfo = resolveLatestStatus(mappedStatusHistory);
  const requestType = instance.get('requestType') as RequestTypeInstance | null;
  const title = instance.get('title') as TitleInstance | null;
  const studyPlan = title?.get('studyPlan') as StudyPlanInstance | null;
  const academicProgram = studyPlan?.get('academicProgram') as AcademicProgramInstance | null;
  const faculty = academicProgram?.get('faculty') as FacultyInstance | null;
  const totalRequirements = requirementSummaries.length;
  const completedRequirements = requirementSummaries.filter((item) => item.isCompleted).length;

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
    completedRequirements,
    requirements: requirementSummaries
  };
};

const buildRequirementSummary = (
  instances: RequestRequirementInstanceInstance[] | undefined,
  requestTypeId: number | null | undefined
): DashboardRequirementSummary[] => {
  const requirementInstances = instances ?? [];

  return requirementInstances.map((requirementInstance) => {
    const requirement = requirementInstance.get('requirement') as RequirementInstance | null;
    const status = requirementInstance.get('status') as RequirementInstanceStatusInstance | null;
    const requirementId = requirementInstance.getDataValue('requirementId') ?? null;

    const responsibility = findResponsibility(
      requirementResponsibilityMap,
      requestTypeId ?? null,
      requirementId
    );

    const statusId = requirementInstance.getDataValue('currentRequirementStatusId');
    let isCompleted = false;
    let isAccepted = false;

    if (typeof statusId === 'number') {
      isCompleted = statusId === REQUIREMENT_STATUS_COMPLETED_ID;
    }

    if (!isCompleted && status) {
      const statusName = status.getDataValue('requirementInstanceStatusName') ?? '';
      isCompleted = statusName.toLowerCase() === REQUIREMENT_STATUS_COMPLETED_ID.toString();
      const normalizedStatus = statusName.toLowerCase();
      isAccepted = [
        REQUIREMENT_STATUS_ACCEPTED_NAME,
        ...REQUIREMENT_STATUS_ACCEPTED_FALLBACK_NAMES
      ]
        .map((value) => value.toLowerCase())
        .includes(normalizedStatus);
    }

    const responsibilityOwner = responsibility ?? RequirementResponsibility.GRADUATE;

    return {
      requirementId,
      requirementInstanceId: requirementInstance.getDataValue('idRequestRequirementInstance'),
      requirementName: requirement?.getDataValue('requirementName') ?? null,
      requirementDescription: requirement?.getDataValue('requirementDescription') ?? null,
      statusId: statusId ?? status?.getDataValue('idRequirementInstanceStatus') ?? null,
      statusName: status?.getDataValue('requirementInstanceStatusName') ?? null,
      completedByUserId: requirementInstance.getDataValue('completedByUserId'),
      verifiedByUserId: requirementInstance.getDataValue('verifiedByUserId'),
      responsibility: responsibilityOwner,
      isCompleted,
      isAccepted
    };
  });
};

export const getDashboardDataForUser = async (
  userId: number,
  rawRoleId: number | null | undefined
): Promise<DashboardData> => {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError('El identificador de usuario es inválido', 400);
  }

  const user = await models.user.findByPk(userId);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const normalizedRoleId = mapRoleId(rawRoleId ?? user.getDataValue('roleId'));
  const requestTypes = await models.requestType.findAll({ order: [['requestTypeName', 'ASC']] });

  let requests: RequestInstance[] = [];

  const baseInclude = [
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
      include: [
        { model: models.requirement, as: 'requirement' },
        { model: models.requirementInstanceStatus, as: 'status' }
      ]
    }
  ];

  const isAdmin = isAdministrativeRole(normalizedRoleId);

  try {
    requests = await models.request.findAll({
      where: isAdmin
        ? {}
        : {
            userId
          },
      include: baseInclude,
      order: [['generatedAt', 'DESC']]
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('requeststatushistory')) {
      requests = await models.request.findAll({
        where: isAdmin
          ? {}
          : {
              userId
            },
        include: baseInclude.filter((relation) => relation !== baseInclude[2]),
        order: [['generatedAt', 'DESC']]
      });
    } else {
      throw error;
    }
  }

  if (isAdmin) {
    requests = requests.filter((requestInstance) => {
      const statusHistory =
        (requestInstance.get('statusHistory') as RequestStatusHistoryInstance[] | undefined) ?? [];
      const latest = resolveLatestStatus(statusHistory);
      const normalized = (latest.statusName ?? '').toLowerCase();
      return [REQUEST_STATUS_IN_FACULTY_NAME, ...REQUEST_STATUS_IN_FACULTY_FALLBACK_NAMES]
        .map((value) => value.toLowerCase())
        .includes(normalized);
    });
  }

  const menuOptions = requestTypes.map(mapMenuOption);
  const requestSummaries = requests.map((requestInstance) => {
    const requestTypeId = requestInstance.getDataValue('requestTypeId');
    const requirementInstances = requestInstance.get('requirementInstances');
    const requirementSummaries = buildRequirementSummary(
      requirementInstances as RequestRequirementInstanceInstance[] | undefined,
      requestTypeId
    );

    const filteredSummaries = requirementSummaries.filter((summary) => {
      if (!isAdmin) {
        return summary.responsibility === RequirementResponsibility.GRADUATE;
      }

      return summary.responsibility === RequirementResponsibility.ADMINISTRATIVE;
    });

    const mergedSummaries = isAdmin ? requirementSummaries : filteredSummaries;

    return mapRequestSummary(requestInstance, mergedSummaries);
  });

  return {
    menuOptions,
    requests: requestSummaries
  };
};
