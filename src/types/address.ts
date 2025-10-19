export interface AddressAttributes {
  idAddress: number;
  street: string | null;
  streetNumber: number | null;
  cityId: number | null;
  personId: number | null;
}

export type AddressCreationAttributes = Omit<AddressAttributes, 'idAddress'>;
