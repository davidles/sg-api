import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequestStatusHistoryAttributes,
  RequestStatusHistoryCreationAttributes
} from '../types/requestStatusHistory';

export type RequestStatusHistoryInstance = Model<
  RequestStatusHistoryAttributes,
  RequestStatusHistoryCreationAttributes
>;
export type RequestStatusHistoryModel = ModelCtor<RequestStatusHistoryInstance>;

export const initRequestStatusHistoryModel = (
  sequelize: Sequelize
): RequestStatusHistoryModel => {
  const requestStatusHistory = sequelize.define<RequestStatusHistoryInstance>(
    'RequestStatusHistory',
    {
      idRequest: {
        field: 'idRequest',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      idRequestStatus: {
        field: 'idRequestStatus',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      statusStartDate: {
        field: 'statusStartDate',
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true
      },
      statusEndDate: {
        field: 'statusEndDate',
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'requeststatushistory',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatusHistory;
};
