import models from '../models';
import type { PersonInstance } from '../models/person';
import type { ContactInstance } from '../models/contact';
import type { GraduateInstance } from '../models/graduate';
import type { PersonAttributes } from '../types/person';
import type { ContactAttributes } from '../types/contact';
import type { GraduateAttributes } from '../types/graduate';

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
  } | null;
};

export const getFormDataForUser = async (userId: number): Promise<FormData> => {
  const user = await models.user.findByPk(userId, {
    include: [
      {
        model: models.person,
        as: 'person',
        include: [
          { model: models.contact, as: 'contact' },
          { model: models.graduate, as: 'graduate' }
        ]
      }
    ]
  });

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
          militaryRankId: graduatePlain.militaryRankId ?? null
        }
      : null
  };
};
