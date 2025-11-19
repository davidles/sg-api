export interface EnrollmentAttributes {
  graduateId: number | null;
  academicProgramId: number | null;
  enrollmentDate: string | null;
  completionDate: string | null;
}

export type EnrollmentCreationAttributes = EnrollmentAttributes;
