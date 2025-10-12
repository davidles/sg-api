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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      idRequestStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      statusStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true
      },
      statusEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'RequestStatusHistory',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatusHistory;
};
