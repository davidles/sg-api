import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequestStatusAttributes,
  RequestStatusCreationAttributes
} from '../types/requestStatus';

export type RequestStatusInstance = Model<
  RequestStatusAttributes,
  RequestStatusCreationAttributes
>;
export type RequestStatusModel = ModelCtor<RequestStatusInstance>;

export const initRequestStatusModel = (
  sequelize: Sequelize
): RequestStatusModel => {
  const requestStatus = sequelize.define<RequestStatusInstance>(
    'RequestStatus',
    {
      idRequestStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idProcessStage: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requestStatusName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      requestStatusDescription: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'RequestStatus',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatus;
};
