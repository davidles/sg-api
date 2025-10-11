export interface RequestAttributes {
  idRequest: number;
  idUser: number | null;
  idRequestType: number | null;
  idTitle: number | null;
  generatedAt: Date | string | null;
}

export type RequestCreationAttributes = Omit<RequestAttributes, 'idRequest'>;
