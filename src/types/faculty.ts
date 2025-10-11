export interface FacultyAttributes {
  idFaculty: number;
  facultyName: string;
}

export type FacultyCreationAttributes = Omit<FacultyAttributes, 'idFaculty'>;
