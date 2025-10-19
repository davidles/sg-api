export interface RequirementAttributes {
  idRequirement: number;
  requirementName: string | null;
  requirementDescription: string | null;
}

export type RequirementCreationAttributes = Omit<RequirementAttributes, 'idRequirement'>;
