export interface CityAttributes {
  idCity: number;
  cityName: string | null;
  provinceId: number | null;
}

export type CityCreationAttributes = Omit<CityAttributes, 'idCity'>;
