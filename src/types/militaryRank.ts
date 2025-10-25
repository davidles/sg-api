export interface MilitaryRankAttributes {
  idMilitaryRank: number;
  militaryRankName: string;
  forceId: number | null;
}

export type MilitaryRankCreationAttributes = Omit<MilitaryRankAttributes, 'idMilitaryRank'>;
