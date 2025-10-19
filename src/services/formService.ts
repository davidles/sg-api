import models from '../models';
import type { PersonInstance } from '../models/person';
import type { ContactInstance } from '../models/contact';
import type { GraduateInstance } from '../models/graduate';
import type { PersonAttributes } from '../types/person';
import type { ContactAttributes, ContactCreationAttributes } from '../types/contact';
import type { GraduateAttributes, GraduateCreationAttributes } from '../types/graduate';
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
  } | null;
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

export const updateFormDataForUser = async (
  userId: number,
  payload: UpdateFormPayload
): Promise<FormData> => {
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

    await transaction.commit();

    return getFormDataForUser(userId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
