export interface StudyPlanAttributes {
  idStudyPlan: number;
  studyPlanName: string | null;
  careerId: number | null;
}

export type StudyPlanCreationAttributes = Omit<StudyPlanAttributes, 'idStudyPlan'>;
