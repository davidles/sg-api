export interface ContactAttributes {
  idContact: number;
  mobilePhone: string | null;
  emailAddress: string | null;
  personId: number | null;
}

export type ContactCreationAttributes = Omit<ContactAttributes, 'idContact'>;
