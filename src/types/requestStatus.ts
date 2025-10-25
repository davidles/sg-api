export interface RequestStatusAttributes {
  idRequestStatus: number;
  requestStatusName: string | null;
  requestStatusDescription: string | null;
}

export type RequestStatusCreationAttributes = Omit<RequestStatusAttributes, 'idRequestStatus'>;
