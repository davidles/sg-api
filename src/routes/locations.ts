import { Router } from 'express';
import { listProvinces, listCitiesByProvince, listCountries, listProvincesByCountry } from '../controllers/locationsController';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, message: 'locations router mounted' });
});

router.get('/provinces', listProvinces);
router.get('/provinces/:provinceId/cities', listCitiesByProvince);
router.get('/countries', listCountries);
router.get('/countries/:countryId/provinces', listProvincesByCountry);

export default router;
