export interface RequirementAttributes {
  idRequirement: number;
  requirementName: string;
  requirementDescription: string | null;
}

export type RequirementCreationAttributes = Omit<RequirementAttributes, 'idRequirement'>;
