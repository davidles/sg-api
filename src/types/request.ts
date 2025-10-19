export interface RequestAttributes {
  idRequest: number;
  userId: number | null;
  requestTypeId: number | null;
  generatedAt: string | null;
}

export type RequestCreationAttributes = Omit<RequestAttributes, 'idRequest'>;
