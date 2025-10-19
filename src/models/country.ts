import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { CountryAttributes, CountryCreationAttributes } from '../types/country';

export type CountryInstance = Model<CountryAttributes, CountryCreationAttributes>;
export type CountryModel = ModelCtor<CountryInstance>;

export const initCountryModel = (sequelize: Sequelize): CountryModel => {
  const country = sequelize.define<CountryInstance>(
    'Country',
    {
      idCountry: {
        field: 'idPais',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      countryName: {
        field: 'paisNombre',
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      tableName: 'pais',
      timestamps: false,
      freezeTableName: true
    }
  );

  return country;
};
