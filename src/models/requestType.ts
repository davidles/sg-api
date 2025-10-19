import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequestTypeAttributes,
  RequestTypeCreationAttributes
} from '../types/requestType';

export type RequestTypeInstance = Model<RequestTypeAttributes, RequestTypeCreationAttributes>;
export type RequestTypeModel = ModelCtor<RequestTypeInstance>;

export const initRequestTypeModel = (sequelize: Sequelize): RequestTypeModel => {
  const requestType = sequelize.define<RequestTypeInstance>(
    'RequestType',
    {
      idRequestType: {
        field: 'idSolicitudTipo',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      requestTypeName: {
        field: 'solicitudTipoNombre',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      requestTypeDescription: {
        field: 'solicitudTipoDescripcion',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'solicitud_tipo',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestType;
};
