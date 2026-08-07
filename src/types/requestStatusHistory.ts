export interface RequestStatusHistoryAttributes {
  idHistorial?: number;
  requestId: number | null;
  requestStatusId: number | null;
  statusStartDate: string | null;
  statusEndDate: string | null;
}

export type RequestStatusHistoryCreationAttributes = RequestStatusHistoryAttributes;
