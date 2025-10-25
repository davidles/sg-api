export interface RequestRequirementInstanceAttributes {
  idRequestRequirementInstance: number;
  requestId: number | null;
  requirementId: number | null;
  completedByUserId: number | null;
  completedAt: string | null;
  verifiedByUserId: number | null;
  verifiedAt: string | null;
  currentRequirementStatusId: number | null;
  complianceVersion: number | null;
  reviewReason: string | null;
  requirementFilePath: string | null;
}

export type RequestRequirementInstanceCreationAttributes = Omit<
  RequestRequirementInstanceAttributes,
  'idRequestRequirementInstance'
>;
