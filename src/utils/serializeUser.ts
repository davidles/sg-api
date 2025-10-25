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

export const serializeUser = (user: UserInstance): SerializedUser => {
  const person = user.get('person') as PersonInstance | null | undefined;
  const directContact = user.get('contact') as ContactInstance | null | undefined;
  const nestedContact = person?.get('contact') as ContactInstance | null | undefined;
  const contact = directContact ?? nestedContact ?? null;
  const graduate = person?.get('graduate') as GraduateInstance | null | undefined;

  const rawBirthDate = person?.getDataValue('birthDate');
  const birthDate = rawBirthDate ? new Date(rawBirthDate).toISOString() : null;

  return {
    id: user.getDataValue('idUser'),
    username: user.getDataValue('username'),
    accountType: user.getDataValue('accountType') ?? null,
    roleId: user.getDataValue('roleId') ?? null,
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
