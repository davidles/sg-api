import models from '../models';
import { AppError } from '../utils/appError';

export const getProvinces = async (): Promise<Array<{ id: number; name: string }>> => {
  const provinces = await models.province.findAll({ order: [['provinceName', 'ASC']] });
  return provinces.map((p) => ({ id: p.getDataValue('idProvince'), name: p.getDataValue('provinceName') ?? '' }));
};

export const getProvincesByCountry = async (
  countryId: number
): Promise<Array<{ id: number; name: string }>> => {
  if (!Number.isFinite(countryId)) {
    throw new AppError('countryId inválido', 400);
  }
  const country = await models.country.findByPk(countryId);
  if (!country) {
    throw new AppError('País no encontrado', 404);
  }
  const provinces = await models.province.findAll({ where: { countryId }, order: [['provinceName', 'ASC']] });
  return provinces.map((p) => ({ id: p.getDataValue('idProvince'), name: p.getDataValue('provinceName') ?? '' }));
};

export const getCitiesByProvince = async (
  provinceId: number
): Promise<Array<{ id: number; name: string }>> => {
  if (!Number.isFinite(provinceId)) {
    throw new AppError('provinceId inválido', 400);
  }
  const province = await models.province.findByPk(provinceId);
  if (!province) {
    throw new AppError('Provincia no encontrada', 404);
  }
  const cities = await models.city.findAll({ where: { provinceId }, order: [['cityName', 'ASC']] });
  return cities.map((c) => ({ id: c.getDataValue('idCity'), name: c.getDataValue('cityName') ?? '' }));
};

export const getCountries = async (): Promise<Array<{ id: number; name: string }>> => {
  const countries = await models.country.findAll({ order: [['countryName', 'ASC']] });
  return countries.map((c) => ({ id: c.getDataValue('idCountry'), name: c.getDataValue('countryName') ?? '' }));
};
