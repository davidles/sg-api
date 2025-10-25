import { Request, Response } from 'express';
import models from '../models';

const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await models.user.findAll({
      attributes: ['idUser', 'username', 'accountType', 'roleId'],
      include: [
        {
          model: models.person,
          as: 'person',
          attributes: ['firstName', 'lastName', 'documentNumber']
        },
        {
          model: models.contact,
          as: 'contact',
          attributes: ['emailAddress', 'mobilePhone']
        }
      ],
      order: [['idUser', 'ASC']]
    });

    const serializedUsers = users.map((user) => {
      const person = user.get('person') as Record<string, unknown> | null;
      const contact = user.get('contact') as Record<string, unknown> | null;

      return {
        id: user.getDataValue('idUser'),
        username: user.getDataValue('username'),
        accountType: user.getDataValue('accountType'),
        roleId: user.getDataValue('roleId'),
        person: person
          ? {
              firstName: (person.firstName as string | null) ?? null,
              lastName: (person.lastName as string | null) ?? null,
              documentNumber: (person.documentNumber as string | null) ?? null
            }
          : null,
        contact: contact
          ? {
              emailAddress: (contact.emailAddress as string | null) ?? null,
              mobilePhone: (contact.mobilePhone as string | null) ?? null
            }
          : null
      };
    });

    res.json(serializedUsers);
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

export { listUsers };
