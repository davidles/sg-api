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
        field: 'idSolicitudEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requestStatusName: {
        field: 'solicitudEstado_Nombre',
        type: DataTypes.STRING(100),
        allowNull: true
      },
      requestStatusDescription: {
        field: 'soliciutdEstado_Descripcion',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'solicitudEstado',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestStatus;
};
