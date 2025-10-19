export interface RequestStatusAttributes {
  idRequestStatus: number;
  processStageId: number | null;
  requestStatusName: string | null;
  requestStatusDescription: string | null;
}

export type RequestStatusCreationAttributes = Omit<RequestStatusAttributes, 'idRequestStatus'>;
