export interface RequestRequirementInstanceAttributes {
  idRequestRequirementInstance: number;
  idRequest: number | null;
  idRequirement: number | null;
  idCompletedByUser: number | null;
  completedAt: string | null;
  idVerifiedByUser: number | null;
  verifiedAt: string | null;
  idCurrentRequirementStatus: number | null;
  complianceVersion: number | null;
  reviewReason: string | null;
}

export type RequestRequirementInstanceCreationAttributes = Omit<
  RequestRequirementInstanceAttributes,
  'idRequestRequirementInstance'
>;
