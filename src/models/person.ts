import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { PersonAttributes, PersonCreationAttributes } from '../types/person';

export type PersonInstance = Model<PersonAttributes, PersonCreationAttributes>;
export type PersonModel = ModelCtor<PersonInstance>;

export const initPersonModel = (sequelize: Sequelize): PersonModel => {
  const person = sequelize.define<PersonInstance>(
    'Person',
    {
      idPerson: {
        field: 'idPersona',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      lastName: {
        field: 'persona_Apellido',
        type: DataTypes.STRING(255),
        allowNull: false
      },
      firstName: {
        field: 'persona_Nombre',
        type: DataTypes.STRING(255),
        allowNull: false
      },
      documentNumber: {
        field: 'persona_DNI',
        type: DataTypes.STRING(50),
        allowNull: false
      },
      birthDate: {
        field: 'persona_Fecha_Nacimiento',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      nationalityId: {
        field: 'idNacionalidad',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      birthCityId: {
        field: 'idCiudadNacimiento',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'persona',
      timestamps: false,
      freezeTableName: true
    }
  );

  return person;
};
