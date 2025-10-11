export interface AcademicProgramAttributes {
  idAcademicProgram: number;
  academicProgramName: string;
  idFaculty: number | null;
}

export type AcademicProgramCreationAttributes = Omit<AcademicProgramAttributes, 'idAcademicProgram'>;
