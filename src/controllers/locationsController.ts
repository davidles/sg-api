import { Request, Response } from 'express';
import { getProvinces, getCitiesByProvince, getCountries, getProvincesByCountry } from '../services/locationService';
import { AppError } from '../utils/appError';

export const listProvinces = async (_req: Request, res: Response): Promise<void> => {
  const data = await getProvinces();
  res.json({ provinces: data });
};

export const listCitiesByProvince = async (req: Request, res: Response): Promise<void> => {
  try {
    const provinceId = Number(req.params.provinceId);
    const data = await getCitiesByProvince(provinceId);
    res.json({ cities: data });
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 400;
    const message = error instanceof Error ? error.message : 'No fue posible obtener ciudades';
    res.status(status).json({ message });
  }
};

export const listCountries = async (_req: Request, res: Response): Promise<void> => {
  const data = await getCountries();
  res.json({ countries: data });
};

export const listProvincesByCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const countryId = Number(req.params.countryId);
    const data = await getProvincesByCountry(countryId);
    res.json({ provinces: data });
  } catch (error) {
    const status = error instanceof AppError ? error.statusCode : 400;
    const message = error instanceof Error ? error.message : 'No fue posible obtener provincias';
    res.status(status).json({ message });
  }
};
