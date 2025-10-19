import { Op } from 'sequelize';
import models from '../models';
import type { StudyPlanInstance } from '../models/studyPlan';
import type { TitleStatusInstance } from '../models/titleStatus';
import { TITLE_STATUS_PENDING_REQUEST_NAME } from '../constants/status';

export type AvailableTitle = {
  idTitle: number;
  titleName: string | null;
  planName: string | null;
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

  const person = user.get('person') as Record<string, unknown> | null;
  const graduate = person?.graduate as Record<string, unknown> | undefined;

  if (!graduate) {
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
      { model: models.studyPlan, as: 'studyPlan' },
      { model: models.titleStatus, as: 'titleStatus' }
    ]
  });

  return titles.map((title) => {
    const plan = title.get('studyPlan') as StudyPlanInstance | undefined;
    const status = title.get('titleStatus') as TitleStatusInstance | undefined;

    return {
      idTitle: title.getDataValue('idTitle'),
      titleName: title.getDataValue('titleName'),
      planName: plan?.getDataValue('studyPlanName') ?? null,
      statusName: status?.getDataValue('titleStatusName') ?? null
    };
  });
};
