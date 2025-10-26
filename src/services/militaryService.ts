import models from '../models';

export const getMilitaryRanks = async (): Promise<Array<{ id: number; name: string }>> => {
  const ranks = await models.militaryRank.findAll({ order: [['militaryRankName', 'ASC']] });
  return ranks.map((r) => ({ id: r.getDataValue('idMilitaryRank'), name: r.getDataValue('militaryRankName') ?? '' }));
};
