export interface TitleAttributes {
  idTitle: number;
  idStudyPlan: number | null;
  titleName: string;
  idTitleStatus: number | null;
  idRequestType: number | null;
}

export type TitleCreationAttributes = Omit<TitleAttributes, 'idTitle'>;
