export interface RequestStatusHistoryAttributes {
  idRequest: number;
  idRequestStatus: number;
  statusStartDate: string;
  statusEndDate: string | null;
}

export type RequestStatusHistoryCreationAttributes = RequestStatusHistoryAttributes;
