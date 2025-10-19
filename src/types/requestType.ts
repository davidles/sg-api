export interface RequestTypeAttributes {
  idRequestType: number;
  requestTypeName: string | null;
  requestTypeDescription: string | null;
}

export type RequestTypeCreationAttributes = Omit<RequestTypeAttributes, 'idRequestType'>;
