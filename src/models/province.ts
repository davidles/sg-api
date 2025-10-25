import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { ProvinceAttributes, ProvinceCreationAttributes } from '../types/province';

export type ProvinceInstance = Model<ProvinceAttributes, ProvinceCreationAttributes>;
export type ProvinceModel = ModelCtor<ProvinceInstance>;

export const initProvinceModel = (sequelize: Sequelize): ProvinceModel => {
  const province = sequelize.define<ProvinceInstance>(
    'Province',
    {
      idProvince: {
        field: 'idProvincia',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      provinceName: {
        field: 'provinciaNombre',
        type: DataTypes.STRING(50),
        allowNull: true
      },
      countryId: {
        field: 'idPais',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'provincia',
      timestamps: false,
      freezeTableName: true
    }
  );

  return province;
};
