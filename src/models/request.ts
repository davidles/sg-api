import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { RequestAttributes, RequestCreationAttributes } from '../types/request';

export type RequestInstance = Model<RequestAttributes, RequestCreationAttributes>;
export type RequestModel = ModelCtor<RequestInstance>;

export const initRequestModel = (sequelize: Sequelize): RequestModel => {
  const request = sequelize.define<RequestInstance>(
    'Request',
    {
      idRequest: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idUser: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      idRequestType: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      idTitle: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      generatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'Request',
      timestamps: false,
      freezeTableName: true
    }
  );

  return request;
};
