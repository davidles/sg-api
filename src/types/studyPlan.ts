export interface StudyPlanAttributes {
  idStudyPlan: number;
  studyPlanName: string;
  idAcademicProgram: number | null;
}

export type StudyPlanCreationAttributes = Omit<StudyPlanAttributes, 'idStudyPlan'>;
