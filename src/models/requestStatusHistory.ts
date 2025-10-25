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
      requestId: {
        field: 'idSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      requestStatusId: {
        field: 'idSolicitudEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      statusStartDate: {
        field: 'fechaInicio_SolicitudEstado',
        type: DataTypes.DATE,
        allowNull: true,
        primaryKey: true
      },
      statusEndDate: {
        field: 'FechaFin_SolicitudEstado',
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'historialSolicitudEstado',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatusHistory;
};
