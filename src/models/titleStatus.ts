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
        field: 'idtituloEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      titleStatusName: {
        field: 'tituloEstadoNombre',
        type: DataTypes.STRING(100),
        allowNull: false
      },
      titleStatusDescription: {
        field: 'tituloEstadoDescripcion',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'tituloEstado',
      timestamps: false,
      freezeTableName: true
    }
  );

  return titleStatus;
};
