export interface ProvinceAttributes {
  idProvince: number;
  provinceName: string | null;
  countryId: number | null;
}

export type ProvinceCreationAttributes = Omit<ProvinceAttributes, 'idProvince'>;
