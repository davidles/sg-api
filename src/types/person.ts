export interface PersonAttributes {
  idPerson: number;
  lastName: string;
  firstName: string;
  documentNumber: string;
  birthDate: Date | string | null;
  nationalityId: number | null;
  birthCityId: number | null;
}

export type PersonCreationAttributes = Omit<PersonAttributes, 'idPerson'>;
