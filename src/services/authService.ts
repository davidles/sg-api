import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Transaction } from 'sequelize';

import models from '../models';
import { sequelize } from '../config/database';
import { AppError } from '../utils/appError';
import { serializeUser, type SerializedUser } from '../utils/serializeUser';

const EMAIL_REGEX = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)+$/i;
const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = 12;

type UserAccountType = 'ACTIVA' | 'INACTIVA';

type CredentialsPayload = {
  username: string;
  password: string;
  accountType?: UserAccountType | null;
  roleId?: number | null;
};

type PersonPayload = {
  firstName: string;
  lastName: string;
  documentNumber: string;
  birthDate: string | null;
  nationalityId: number | null;
  birthCityId: number | null;
};

type ContactPayload = {
  emailAddress: string;
  mobilePhone?: string | null;
};

type AddressPayload = {
  street: string;
  streetNumber: number;
  cityId: number;
};

type GraduatePayload = {
  graduateType: 'Civil' | 'Militar';
  militaryRankId?: number | null;
};

type RegisterUserPayload = {
  credentials: CredentialsPayload;
  person: PersonPayload;
  contact: ContactPayload;
  address: AddressPayload;
  graduate?: GraduatePayload | null;
};

type LoginPayload = {
  username: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: SerializedUser;
};

const ensureString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(`${fieldName} es obligatorio`, 400);
  }

  return value.trim();
};

const ensureNumber = (value: unknown, fieldName: string): number => {
  const parsedValue = typeof value === 'string' ? Number(value) : (value as number);

  if (typeof parsedValue !== 'number' || Number.isNaN(parsedValue)) {
    throw new AppError(`${fieldName} debe ser numérico`, 400);
  }

  return parsedValue;
};

export const USER_DEFAULT_INCLUDE = [
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
];

const validateRegisterPayload = async (payload: RegisterUserPayload): Promise<{
  credentials: {
    username: string;
    password: string;
    accountType: UserAccountType;
    roleId: number;
  };
  person: PersonPayload & { nationalityId: number | null; birthCityId: number | null };
  contact: ContactPayload;
  address: AddressPayload;
  graduate: GraduatePayload | null;
}> => {
  if (!payload) {
    throw new AppError('No se recibieron datos para registrar al usuario', 400);
  }

  const username = ensureString(payload.credentials?.username, 'El usuario');
  const normalizedUsername = username.toLowerCase();
  const password = ensureString(payload.credentials?.password, 'La contraseña');

  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`, 400);
  }

  const firstName = ensureString(payload.person?.firstName, 'El nombre');
  const lastName = ensureString(payload.person?.lastName, 'El apellido');
  const documentNumber = ensureString(
    payload.person?.documentNumber,
    'El número de documento'
  );

  const emailAddress = ensureString(payload.contact?.emailAddress, 'El correo electrónico');

  if (!EMAIL_REGEX.test(emailAddress)) {
    throw new AppError('El correo electrónico no tiene un formato válido', 400);
  }

  const street = ensureString(payload.address?.street, 'La calle');
  const streetNumber = ensureNumber(payload.address?.streetNumber, 'El número de calle');
  const cityId = ensureNumber(payload.address?.cityId, 'La ciudad');

  const birthDate = typeof payload.person?.birthDate === 'string'
    ? payload.person.birthDate
    : null;

  const nationalityId =
    payload.person?.nationalityId !== null && payload.person?.nationalityId !== undefined
      ? ensureNumber(payload.person.nationalityId, 'La nacionalidad')
      : null;
  const birthCityId =
    payload.person?.birthCityId !== null && payload.person?.birthCityId !== undefined
      ? ensureNumber(payload.person.birthCityId, 'La ciudad de nacimiento')
      : null;

  const graduateType = payload.graduate?.graduateType ?? 'Civil';
  let militaryRankId: number | null = null;

  if (graduateType === 'Militar') {
    militaryRankId = ensureNumber(
      payload.graduate?.militaryRankId,
      'El grado militar'
    );

    const existingRank = await models.militaryRank.findByPk(militaryRankId);

    if (!existingRank) {
      throw new AppError('El grado militar seleccionado no existe', 400);
    }
  }

  const existingCity = await models.city.findByPk(cityId);

  if (!existingCity) {
    throw new AppError('La ciudad seleccionada no existe', 400);
  }

  if (birthCityId !== null) {
    const existingBirthCity = await models.city.findByPk(birthCityId);

    if (!existingBirthCity) {
      throw new AppError('La ciudad de nacimiento seleccionada no existe', 400);
    }
  }

  if (nationalityId !== null) {
    const existingCountry = await models.country.findByPk(nationalityId);

    if (!existingCountry) {
      throw new AppError('La nacionalidad seleccionada no existe', 400);
    }
  }

  const rawAccountType =
    typeof payload.credentials?.accountType === 'string'
      ? payload.credentials.accountType.trim().toUpperCase()
      : null;

  let accountType: UserAccountType = 'ACTIVA';

  if (rawAccountType) {
    if (rawAccountType !== 'ACTIVA' && rawAccountType !== 'INACTIVA') {
      throw new AppError('El estado de la cuenta debe ser ACTIVA o INACTIVA', 400);
    }

    accountType = rawAccountType;
  }

  const roleId = ensureNumber(payload.credentials?.roleId, 'El rol');

  return {
    credentials: {
      username: normalizedUsername,
      password,
      accountType,
      roleId
    },
    person: {
      firstName,
      lastName,
      documentNumber,
      birthDate,
      nationalityId,
      birthCityId
    },
    contact: {
      emailAddress,
      mobilePhone: payload.contact?.mobilePhone ?? null
    },
    address: {
      street,
      streetNumber,
      cityId
    },
    graduate: {
      graduateType,
      militaryRankId
    }
  };
};

const createPersonGraph = async (
  payload: Awaited<ReturnType<typeof validateRegisterPayload>>,
  transaction: Transaction
): Promise<number> => {
  const personInstance = await models.person.create(
    {
      firstName: payload.person.firstName,
      lastName: payload.person.lastName,
      documentNumber: payload.person.documentNumber,
      birthDate: payload.person.birthDate ? new Date(payload.person.birthDate) : null,
      nationalityId: payload.person.nationalityId,
      birthCityId: payload.person.birthCityId
    },
    { transaction }
  );

  const personId = personInstance.getDataValue('idPerson');

  await models.contact.create(
    {
      emailAddress: payload.contact.emailAddress,
      mobilePhone: payload.contact.mobilePhone ?? null,
      personId
    },
    { transaction }
  );

  await models.address.create(
    {
      street: payload.address.street,
      streetNumber: payload.address.streetNumber,
      cityId: payload.address.cityId,
      personId
    },
    { transaction }
  );

  await models.graduate.create(
    {
      personId,
      graduateType: payload.graduate?.graduateType ?? 'Civil',
      militaryRankId:
        payload.graduate?.graduateType === 'Militar'
          ? payload.graduate?.militaryRankId ?? null
          : null
    },
    { transaction }
  );

  return personId;
};

export const registerUser = async (
  payload: RegisterUserPayload
): Promise<SerializedUser> => {
  const normalizedPayload = await validateRegisterPayload(payload);

  const userId = await sequelize.transaction(async (transaction) => {
    const existingUser = await models.user.findOne({
      where: { username: normalizedPayload.credentials.username },
      transaction
    });

    if (existingUser) {
      throw new AppError('El nombre de usuario ya se encuentra registrado', 409);
    }

    const personId = await createPersonGraph(normalizedPayload, transaction);
    const passwordHash = await bcrypt.hash(
      normalizedPayload.credentials.password,
      SALT_ROUNDS
    );

    const userInstance = await models.user.create(
      {
        username: normalizedPayload.credentials.username,
        password: passwordHash,
        accountType: normalizedPayload.credentials.accountType,
        roleId: normalizedPayload.credentials.roleId,
        personId
      },
      { transaction }
    );

    return userInstance.getDataValue('idUser');
  });

  const createdUser = await models.user.findByPk(userId, {
    include: USER_DEFAULT_INCLUDE
  });

  if (!createdUser) {
    throw new AppError('No fue posible recuperar el usuario registrado', 500);
  }

  return serializeUser(createdUser);
};

export const authenticateUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const username = ensureString(payload?.username, 'El usuario');
  const normalizedUsername = username.toLowerCase();
  const password = ensureString(payload?.password, 'La contraseña');

  const userInstance = await models.user.findOne({
    where: { username: normalizedUsername },
    include: USER_DEFAULT_INCLUDE
  });

  if (!userInstance) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const passwordHash = userInstance.getDataValue('password');
  const isValidPassword = await bcrypt.compare(password, passwordHash);

  if (!isValidPassword) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const serializedUser = serializeUser(userInstance);
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError('JWT_SECRET no está configurado en el servidor', 500);
  }

  const expiresIn = process.env.JWT_EXPIRES_IN ?? '1h';

  const jwtPayload: Record<string, unknown> = {
    sub: serializedUser.id,
    username: serializedUser.username,
    roleId: serializedUser.roleId,
    personId: serializedUser.personId
  };

  const signOptions: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn']
  };

  const token = jwt.sign(jwtPayload, jwtSecret, signOptions);

  return {
    token,
    user: serializedUser
  };
};
