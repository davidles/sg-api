export interface RequestTypeAttributes {
  idRequestType: number;
  requestTypeName: string;
  requestTypeDescription: string | null;
}

export type RequestTypeCreationAttributes = Omit<RequestTypeAttributes, 'idRequestType'>;
