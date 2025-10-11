export interface RequirementInstanceStatusAttributes {
  idRequirementInstanceStatus: number;
  requirementInstanceStatusName: string;
  requirementInstanceStatusDescription: string | null;
}

export type RequirementInstanceStatusCreationAttributes = Omit<
  RequirementInstanceStatusAttributes,
  'idRequirementInstanceStatus'
>;
