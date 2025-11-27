import type { UserInstance } from '../models/user';
import type { PersonInstance } from '../models/person';
import type { ContactInstance } from '../models/contact';
import type { GraduateInstance } from '../models/graduate';

export type SerializedUser = {
  id: number;
  username: string;
  accountType: string | null;
  roleId: number | null;
  personId: number | null;
  firstName: string | null;
  lastName: string | null;
  documentNumber: string | null;
  birthDate: string | null;
  nationalityId: number | null;
  birthCityId: number | null;
  emailAddress: string | null;
  mobilePhone: string | null;
  graduateType: 'Civil' | 'Militar' | null;
  militaryRankId: number | null;
};

const mapRoleId = (rawRoleId: number | null | undefined): number | null => {
  if (rawRoleId === null || rawRoleId === undefined) {
    return null;
  }

  switch (rawRoleId) {
    case 1: // Administrador
      return 300;
    case 2: // Administrativo Facultad
      return 200;
    case 3: // Egresado
      return 100;
    case 4: // Diplomado
      return 120;
    case 5: // Administrativo consultor
      return 210;
    default:
      return rawRoleId;
  }
};

export const serializeUser = (user: UserInstance): SerializedUser => {
  const person = user.get('person') as PersonInstance | null | undefined;
  const directContact = user.get('contact') as ContactInstance | null | undefined;
  const nestedContact = person?.get('contact') as ContactInstance | null | undefined;
  const contact = directContact ?? nestedContact ?? null;
  const graduate = person?.get('graduate') as GraduateInstance | null | undefined;

  const normalizedRoleId = mapRoleId(user.getDataValue('roleId'));

  const rawBirthDate = person?.getDataValue('birthDate');
  const birthDate = rawBirthDate ? new Date(rawBirthDate).toISOString() : null;

  return {
    id: user.getDataValue('idUser'),
    username: user.getDataValue('username'),
    accountType: user.getDataValue('accountType') ?? null,
    roleId: normalizedRoleId,
    personId: person?.getDataValue('idPerson') ?? null,
    firstName: person?.getDataValue('firstName') ?? null,
    lastName: person?.getDataValue('lastName') ?? null,
    documentNumber: person?.getDataValue('documentNumber') ?? null,
    birthDate,
    nationalityId: person?.getDataValue('nationalityId') ?? null,
    birthCityId: person?.getDataValue('birthCityId') ?? null,
    emailAddress: contact?.getDataValue('emailAddress') ?? null,
    mobilePhone: contact?.getDataValue('mobilePhone') ?? null,
    graduateType: graduate?.getDataValue('graduateType') ?? null,
    militaryRankId: graduate?.getDataValue('militaryRankId') ?? null
  };
};
