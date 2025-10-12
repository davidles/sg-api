export interface RequestStatusAttributes {
  idRequestStatus: number;
  idProcessStage: number | null;
  requestStatusName: string;
  requestStatusDescription: string | null;
}

export type RequestStatusCreationAttributes = Omit<RequestStatusAttributes, 'idRequestStatus'>;
