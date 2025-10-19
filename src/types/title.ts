export interface TitleAttributes {
  idTitle: number;
  studyPlanId: number | null;
  titleName: string | null;
  titleTypeId: number | null;
  requestTypeId: number | null;
  titleStatusId: number | null;
}

export type TitleCreationAttributes = Omit<TitleAttributes, 'idTitle'>;
