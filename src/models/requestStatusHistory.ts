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
      idHistorial: {
        field: 'idHistorial',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requestId: {
        field: 'idSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      requestStatusId: {
        field: 'idSolicitudEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      statusStartDate: {
        field: 'fechaInicio_SolicitudEstado',
        type: DataTypes.DATE,
        allowNull: true
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
