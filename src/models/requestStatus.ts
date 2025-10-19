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
        field: 'idRequestStatus',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      processStageId: {
        field: 'idProcessStage',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requestStatusName: {
        field: 'requestStatusName',
        type: DataTypes.STRING(100),
        allowNull: true
      },
      requestStatusDescription: {
        field: 'requestStatusDescription',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'requeststatus',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatus;
};
