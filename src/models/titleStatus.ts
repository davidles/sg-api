import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  TitleStatusAttributes,
  TitleStatusCreationAttributes
} from '../types/titleStatus';

export type TitleStatusInstance = Model<TitleStatusAttributes, TitleStatusCreationAttributes>;
export type TitleStatusModel = ModelCtor<TitleStatusInstance>;

export const initTitleStatusModel = (sequelize: Sequelize): TitleStatusModel => {
  const titleStatus = sequelize.define<TitleStatusInstance>(
    'TitleStatus',
    {
      idTitleStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      titleStatusName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      titleStatusDescription: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'TitleStatus',
      timestamps: false,
      freezeTableName: true
    }
  );

  return titleStatus;
};
