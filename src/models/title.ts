import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { TitleAttributes, TitleCreationAttributes } from '../types/title';

export type TitleInstance = Model<TitleAttributes, TitleCreationAttributes>;
export type TitleModel = ModelCtor<TitleInstance>;

export const initTitleModel = (sequelize: Sequelize): TitleModel => {
  const title = sequelize.define<TitleInstance>(
    'Title',
    {
      idTitle: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      idStudyPlan: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      titleName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      idTitleStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      idRequestType: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'Title',
      timestamps: false,
      freezeTableName: true
    }
  );

  return title;
};
