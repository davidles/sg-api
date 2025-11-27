export interface DashboardMenuOption {
  id: number;
  name: string | null;
  description: string | null;
}

export type RequirementResponsibilityType = 'GRADUATE' | 'ADMINISTRATIVE';

export interface DashboardRequirementSummary {
  requirementId: number | null;
  requirementInstanceId: number | null;
  requirementName: string | null;
  requirementDescription: string | null;
  statusId: number | null;
  statusName: string | null;
  completedByUserId: number | null;
  verifiedByUserId: number | null;
  responsibility: RequirementResponsibilityType;
  isCompleted: boolean;
  isAccepted: boolean;
}

export interface DashboardRequestSummary {
  idRequest: number;
  requestTypeName: string | null;
  generatedAt: string | null;
  statusName: string | null;
  statusDescription: string | null;
  nextAction: string;
  requestTypeId: number | null;
  academicProgramName: string | null;
  facultyName: string | null;
  planName: string | null;
  totalRequirements: number | null;
  completedRequirements: number | null;
  requirements?: DashboardRequirementSummary[];
}

export interface DashboardData {
  menuOptions: DashboardMenuOption[];
  requests: DashboardRequestSummary[];
}
