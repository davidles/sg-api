import { Op } from 'sequelize';
import models from '../models';
import type { StudyPlanInstance } from '../models/studyPlan';
import type { AcademicProgramInstance } from '../models/academicProgram';
import type { FacultyInstance } from '../models/faculty';
import type { TitleStatusInstance } from '../models/titleStatus';
import type { RequestTypeInstance } from '../models/requestType';
import type { PersonInstance } from '../models/person';
import type { GraduateInstance } from '../models/graduate';
import { TITLE_STATUS_PENDING_REQUEST_NAME } from '../constants/status';

export type AvailableTitle = {
  idTitle: number;
  studyPlanId: number | null;
  titleName: string | null;
  planName: string | null;
  academicProgramName: string | null;
  facultyName: string | null;
  requestTypeId: number | null;
  requestTypeName: string | null;
  statusName: string | null;
};

export const findAvailableTitlesForUser = async (userId: number): Promise<AvailableTitle[]> => {
  const user = await models.user.findByPk(userId, {
    include: [
      {
        model: models.person,
        as: 'person',
        include: [{ model: models.graduate, as: 'graduate' }]
      }
    ]
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const personInstance = user.get('person') as PersonInstance | null;

  if (!personInstance) {
    throw new Error('El usuario no tiene datos personales asociados');
  }

  const graduateInstance = personInstance.get('graduate') as GraduateInstance | null;

  if (!graduateInstance) {
    return [];
  }

  const pendingStatus = await models.titleStatus.findOne({
    where: {
      titleStatusName: {
        [Op.like]: `%${TITLE_STATUS_PENDING_REQUEST_NAME}%`
      }
    }
  });

  if (!pendingStatus) {
    return [];
  }

  const titles = await models.title.findAll({
    where: {
      titleStatusId: pendingStatus.getDataValue('idTitleStatus')
    },
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
      },
      { model: models.titleStatus, as: 'titleStatus' },
      { model: models.requestType, as: 'requestType' }
    ]
  });

  return titles.map((title) => {
    const plan = title.get('studyPlan') as StudyPlanInstance | undefined;
    const academicProgram = plan
      ? (plan.get('academicProgram') as AcademicProgramInstance | null)
      : null;
    const faculty = academicProgram
      ? (academicProgram.get('faculty') as FacultyInstance | null)
      : null;
    const status = title.get('titleStatus') as TitleStatusInstance | undefined;
    const requestType = title.get('requestType') as RequestTypeInstance | undefined;

    return {
      idTitle: title.getDataValue('idTitle'),
      studyPlanId: title.getDataValue('studyPlanId') ?? null,
      titleName: title.getDataValue('titleName'),
      planName: plan?.getDataValue('studyPlanName') ?? null,
      academicProgramName: academicProgram?.getDataValue('academicProgramName') ?? null,
      facultyName: faculty?.getDataValue('facultyName') ?? null,
      requestTypeId: title.getDataValue('requestTypeId') ?? null,
      requestTypeName: requestType?.getDataValue('requestTypeName') ?? null,
      statusName: status?.getDataValue('titleStatusName') ?? null
    };
  });
};
