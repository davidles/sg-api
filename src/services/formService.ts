import models from '../models';
import type { PersonInstance } from '../models/person';
import type { ContactInstance } from '../models/contact';
import type { GraduateInstance } from '../models/graduate';
import type { AddressInstance } from '../models/address';
import type { CityInstance } from '../models/city';
import type { ProvinceInstance } from '../models/province';
import type { CountryInstance } from '../models/country';
import type { MilitaryRankInstance } from '../models/militaryRank';
import type { ForceInstance } from '../models/force';
import type { PersonAttributes } from '../types/person';
import type { ContactAttributes, ContactCreationAttributes } from '../types/contact';
import type { GraduateAttributes, GraduateCreationAttributes } from '../types/graduate';
import type { AddressAttributes, AddressCreationAttributes } from '../types/address';
import type { CityAttributes } from '../types/city';
import type { ProvinceAttributes } from '../types/province';
import type { CountryAttributes } from '../types/country';
import type { ForceAttributes } from '../types/force';
import type { MilitaryRankAttributes } from '../types/militaryRank';
import { sequelize } from '../config/database';
import { Transaction } from 'sequelize';

export type FormData = {
  person: {
    idPerson: number;
    lastName: string;
    firstName: string;
    documentNumber: string;
    birthDate: string | null;
    nationalityId: number | null;
    birthCityId: number | null;
  };
  contact: {
    idContact: number;
    mobilePhone: string | null;
    emailAddress: string | null;
  } | null;
  graduate: {
    idGraduate: number;
    graduateType: GraduateAttributes['graduateType'];
    militaryRankId: number | null;
    forceId: number | null;
  } | null;
  address: {
    idAddress: number;
    street: string | null;
    streetNumber: number | null;
    cityId: number | null;
    city: CityAttributes | null;
    province: ProvinceAttributes | null;
    country: CountryAttributes | null;
  } | null;
  catalogs: {
    forces: ForceAttributes[];
    militaryRanks: MilitaryRankAttributes[];
    countries: CountryAttributes[];
    provinces: ProvinceAttributes[];
    cities: CityAttributes[];
  };
};

export type UpdateFormPayload = {
  person: {
    lastName: string;
    firstName: string;
    documentNumber: string;
    birthDate: string | null;
    nationalityId: number | null;
    birthCityId: number | null;
  };
  contact: {
    mobilePhone: string | null;
    emailAddress: string | null;
  } | null;
  graduate: {
    graduateType: GraduateAttributes['graduateType'];
    militaryRankId: number | null;
    forceId: number | null;
  } | null;
  address: {
    street: string | null;
    streetNumber: number | null;
    cityId: number | null;
  } | null;
};

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/i;

const ensureString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} es obligatorio`);
  }

  return value.trim();
};

const validateUpdatePayload = async (payload: UpdateFormPayload): Promise<void> => {
  ensureString(payload.person.firstName, 'El nombre');
  ensureString(payload.person.lastName, 'El apellido');
  ensureString(payload.person.documentNumber, 'El número de documento');

  if (payload.contact?.emailAddress) {
    if (!EMAIL_REGEX.test(payload.contact.emailAddress)) {
      throw new Error('El correo electrónico no tiene un formato válido');
    }
  }

  if (payload.address) {
    ensureString(payload.address.street, 'La calle');

    if (payload.address.streetNumber === null || payload.address.streetNumber === undefined) {
      throw new Error('El número de calle es obligatorio');
    }

    if (!payload.address.cityId) {
      throw new Error('La ciudad es obligatoria');
    }

    const city = await models.city.findByPk(payload.address.cityId, {
      include: [
        {
          model: models.province,
          as: 'province',
          include: [{ model: models.country, as: 'country' }]
        }
      ]
    });

    if (!city) {
      throw new Error('La ciudad seleccionada no existe');
    }
  }

  if (payload.graduate) {
    const { graduateType, militaryRankId, forceId } = payload.graduate;

    if (!graduateType) {
      throw new Error('El tipo de egresado es obligatorio');
    }

    if (graduateType === 'Militar') {
      if (!militaryRankId) {
        throw new Error('Debe seleccionar un grado militar');
      }

      const rank = await models.militaryRank.findByPk(militaryRankId, {
        include: [{ model: models.force, as: 'force' }]
      });

      if (!rank) {
        throw new Error('El grado militar seleccionado no existe');
      }

      const rankForce = rank.get('force') as ForceInstance | null;
      const rankForceId = rankForce
        ? (rankForce.get({ plain: true }) as ForceAttributes).idForce
        : null;

      if (rankForceId && forceId && rankForceId !== forceId) {
        throw new Error('El grado militar no pertenece a la fuerza seleccionada');
      }

      payload.graduate.forceId = rankForceId ?? forceId ?? null;
    } else {
      payload.graduate.militaryRankId = null;
      payload.graduate.forceId = null;
    }
  }
};

export const getFormDataForUser = async (userId: number): Promise<FormData> => {
  const [
    user,
    forceInstances,
    militaryRankInstances,
    countryInstances,
    provinceInstances,
    cityInstances
  ] = await Promise.all([
    models.user.findByPk(userId, {
      include: [
        {
          model: models.person,
          as: 'person',
          include: [
            { model: models.contact, as: 'contact' },
            {
              model: models.address,
              as: 'address',
              include: [
                {
                  model: models.city,
                  as: 'city',
                  include: [
                    {
                      model: models.province,
                      as: 'province',
                      include: [{ model: models.country, as: 'country' }]
                    }
                  ]
                }
              ]
            },
            {
              model: models.graduate,
              as: 'graduate',
              include: [
                {
                  model: models.militaryRank,
                  as: 'militaryRank',
                  include: [{ model: models.force, as: 'force' }]
                }
              ]
            }
          ]
        }
      ]
    }),
    models.force.findAll(),
    models.militaryRank.findAll(),
    models.country.findAll(),
    models.province.findAll(),
    models.city.findAll()
  ]);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const personInstance = user.get('person') as PersonInstance | null;

  if (!personInstance) {
    throw new Error('El usuario no tiene datos personales asociados');
  }

  const personPlain = personInstance.get({ plain: true }) as PersonAttributes;

  const contactInstance = personInstance.get('contact') as ContactInstance | null;
  const contactPlain = contactInstance
    ? (contactInstance.get({ plain: true }) as ContactAttributes)
    : null;

  const graduateInstance = personInstance.get('graduate') as GraduateInstance | null;
  const graduatePlain = graduateInstance
    ? (graduateInstance.get({ plain: true }) as GraduateAttributes)
    : null;
  const militaryRankInstance = graduateInstance
    ? (graduateInstance.get('militaryRank') as MilitaryRankInstance | null)
    : null;
  const militaryRankPlain = militaryRankInstance
    ? (militaryRankInstance.get({ plain: true }) as MilitaryRankAttributes)
    : null;
  const forceInstance = militaryRankInstance
    ? (militaryRankInstance.get('force') as ForceInstance | null)
    : null;
  const forcePlain = forceInstance
    ? (forceInstance.get({ plain: true }) as ForceAttributes)
    : null;

  const addressInstance = personInstance.get('address') as AddressInstance | null;
  const addressPlain = addressInstance
    ? (addressInstance.get({ plain: true }) as AddressAttributes)
    : null;
  const cityInstance = addressInstance
    ? (addressInstance.get('city') as CityInstance | null)
    : null;
  const cityPlain = cityInstance ? (cityInstance.get({ plain: true }) as CityAttributes) : null;
  const provinceInstance = cityInstance
    ? (cityInstance.get('province') as ProvinceInstance | null)
    : null;
  const provincePlain = provinceInstance
    ? (provinceInstance.get({ plain: true }) as ProvinceAttributes)
    : null;
  const countryInstance = provinceInstance
    ? (provinceInstance.get('country') as CountryInstance | null)
    : null;
  const countryPlain = countryInstance
    ? (countryInstance.get({ plain: true }) as CountryAttributes)
    : null;

  const forces = forceInstances.map((instance) =>
    instance.get({ plain: true }) as ForceAttributes
  );
  const militaryRanks = militaryRankInstances.map((instance) =>
    instance.get({ plain: true }) as MilitaryRankAttributes
  );
  const countries = countryInstances.map((instance) =>
    instance.get({ plain: true }) as CountryAttributes
  );
  const provinces = provinceInstances.map((instance) =>
    instance.get({ plain: true }) as ProvinceAttributes
  );
  const cities = cityInstances.map((instance) =>
    instance.get({ plain: true }) as CityAttributes
  );

  return {
    person: {
      idPerson: personPlain.idPerson,
      lastName: personPlain.lastName,
      firstName: personPlain.firstName,
      documentNumber: personPlain.documentNumber,
      birthDate: personPlain.birthDate ? personPlain.birthDate.toString() : null,
      nationalityId: personPlain.nationalityId ?? null,
      birthCityId: personPlain.birthCityId ?? null
    },
    contact: contactPlain
      ? {
          idContact: contactPlain.idContact,
          mobilePhone: contactPlain.mobilePhone,
          emailAddress: contactPlain.emailAddress
        }
      : null,
    graduate: graduatePlain
      ? {
          idGraduate: graduatePlain.idGraduate,
          graduateType: graduatePlain.graduateType,
          militaryRankId: graduatePlain.militaryRankId ?? null,
          forceId: militaryRankPlain?.forceId ?? forcePlain?.idForce ?? null
        }
      : null,
    address: addressPlain
      ? {
          idAddress: addressPlain.idAddress,
          street: addressPlain.street,
          streetNumber: addressPlain.streetNumber,
          cityId: addressPlain.cityId,
          city: cityPlain,
          province: provincePlain,
          country: countryPlain
        }
      : null,
    catalogs: {
      forces,
      militaryRanks,
      countries,
      provinces,
      cities
    }
  };
};

const upsertContact = async (
  personId: number,
  payload: UpdateFormPayload['contact'],
  transaction: Transaction
): Promise<void> => {
  const existingContact = await models.contact.findOne({
    where: { personId },
    transaction
  });

  if (!payload) {
    if (existingContact) {
      await existingContact.update(
        {
          mobilePhone: null,
          emailAddress: null
        },
        { transaction }
      );
    }
    return;
  }

  const contactData: Partial<ContactCreationAttributes> = {
    mobilePhone: payload.mobilePhone,
    emailAddress: payload.emailAddress,
    personId
  };

  if (existingContact) {
    await existingContact.update(contactData, { transaction });
    return;
  }

  await models.contact.create(contactData, { transaction });
};

const upsertGraduate = async (
  personId: number,
  payload: UpdateFormPayload['graduate'],
  transaction: Transaction
): Promise<void> => {
  const existingGraduate = await models.graduate.findOne({
    where: { personId },
    transaction
  });

  if (!payload) {
    if (existingGraduate) {
      await existingGraduate.update(
        {
          graduateType: null,
          militaryRankId: null
        },
        { transaction }
      );
    }
    return;
  }

  const graduateData: Partial<GraduateCreationAttributes> = {
    graduateType: payload.graduateType ?? null,
    militaryRankId: payload.militaryRankId ?? null,
    personId
  };

  if (existingGraduate) {
    await existingGraduate.update(graduateData, { transaction });
    return;
  }

  await models.graduate.create(graduateData, { transaction });
};

const upsertAddress = async (
  personId: number,
  payload: UpdateFormPayload['address'],
  transaction: Transaction
): Promise<void> => {
  const existingAddress = await models.address.findOne({
    where: { personId },
    transaction
  });

  if (!payload) {
    if (existingAddress) {
      await existingAddress.destroy({ transaction });
    }
    return;
  }

  const addressData: AddressCreationAttributes = {
    street: payload.street,
    streetNumber: payload.streetNumber ?? 0,
    cityId: payload.cityId,
    personId
  };

  if (existingAddress) {
    await existingAddress.update(addressData, { transaction });
    return;
  }

  await models.address.create(addressData, { transaction });
};

export const updateFormDataForUser = async (
  userId: number,
  payload: UpdateFormPayload
): Promise<FormData> => {
  await validateUpdatePayload(payload);

  const transaction = await sequelize.transaction();

  try {
    const user = await models.user.findByPk(userId, {
      transaction
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const personId = user.getDataValue('personId');

    if (!personId) {
      throw new Error('El usuario no tiene datos personales asociados');
    }

    await models.person.update(
      {
        lastName: payload.person.lastName,
        firstName: payload.person.firstName,
        documentNumber: payload.person.documentNumber,
        birthDate: payload.person.birthDate,
        nationalityId: payload.person.nationalityId,
        birthCityId: payload.person.birthCityId
      },
      {
        where: { idPerson: personId },
        transaction
      }
    );

    await upsertContact(personId, payload.contact, transaction);
    await upsertGraduate(personId, payload.graduate, transaction);
    await upsertAddress(personId, payload.address, transaction);

    await transaction.commit();

    return getFormDataForUser(userId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
