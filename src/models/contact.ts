import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { ContactAttributes, ContactCreationAttributes } from '../types/contact';

export type ContactInstance = Model<ContactAttributes, ContactCreationAttributes>;
export type ContactModel = ModelCtor<ContactInstance>;

export const initContactModel = (sequelize: Sequelize): ContactModel => {
  const contact = sequelize.define<ContactInstance>(
    'Contact',
    {
      idContact: {
        field: 'idContacto',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      mobilePhone: {
        field: 'contactoCelular',
        type: DataTypes.STRING(45),
        allowNull: true
      },
      emailAddress: {
        field: 'contactoMail',
        type: DataTypes.STRING(45),
        allowNull: true
      },
      personId: {
        field: 'idContactoPersona',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'contacto',
      timestamps: false,
      freezeTableName: true
    }
  );

  return contact;
};
