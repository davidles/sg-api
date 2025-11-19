export interface RequestRequirementInstanceAttributes {
  idRequestRequirementInstance: number;
  requestId: number | null;
  requirementId: number | null;
  completedByUserId: number | null;
  completedAt: string | null;
  verifiedByUserId: number | null;
  verifiedAt: string | null;
  currentRequirementStatusId: number | null;
  completionVersion: number | null;
  reviewReason: string | null;
  requirementFilePath: string | null;
  fileBlob: Buffer | null;
}

export type RequestRequirementInstanceCreationAttributes = Omit<
  RequestRequirementInstanceAttributes,
  'idRequestRequirementInstance'
>;
