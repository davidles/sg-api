export interface RequestStatusHistoryAttributes {
  requestId: number;
  requestStatusId: number;
  statusStartDate: string;
  statusEndDate: string | null;
}

export type RequestStatusHistoryCreationAttributes = RequestStatusHistoryAttributes;
