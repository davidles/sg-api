export interface TitleStatusAttributes {
  idTitleStatus: number;
  titleStatusName: string;
  titleStatusDescription: string | null;
}

export type TitleStatusCreationAttributes = Omit<TitleStatusAttributes, 'idTitleStatus'>;
