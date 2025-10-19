export interface GraduateAttributes {
  idGraduate: number;
  personId: number | null;
  militaryRankId: number | null;
  graduateType: 'Civil' | 'Militar' | null;
}

export type GraduateCreationAttributes = Omit<GraduateAttributes, 'idGraduate'>;
