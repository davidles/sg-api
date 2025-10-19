import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { CityAttributes, CityCreationAttributes } from '../types/city';

export type CityInstance = Model<CityAttributes, CityCreationAttributes>;
export type CityModel = ModelCtor<CityInstance>;

export const initCityModel = (sequelize: Sequelize): CityModel => {
  const city = sequelize.define<CityInstance>(
    'City',
    {
      idCity: {
        field: 'idCiudad',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      cityName: {
        field: 'ciudadNombre',
        type: DataTypes.STRING(50),
        allowNull: true
      },
      provinceId: {
        field: 'idProvincia',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'ciudad',
      timestamps: false,
      freezeTableName: true
    }
  );

  return city;
};
