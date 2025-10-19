export interface CountryAttributes {
  idCountry: number;
  countryName: string | null;
}

export type CountryCreationAttributes = Omit<CountryAttributes, 'idCountry'>;
