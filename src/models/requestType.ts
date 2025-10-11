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
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      requestTypeName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      requestTypeDescription: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'RequestType',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestType;
};
