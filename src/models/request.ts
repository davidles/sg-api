import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { RequestAttributes, RequestCreationAttributes } from '../types/request';

export type RequestInstance = Model<RequestAttributes, RequestCreationAttributes>;
export type RequestModel = ModelCtor<RequestInstance>;

export const initRequestModel = (sequelize: Sequelize): RequestModel => {
  const request = sequelize.define<RequestInstance>(
    'Request',
    {
      idRequest: {
        field: 'idSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        field: 'solicitudIdUsuario',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requestTypeId: {
        field: 'solicitudIdTipoSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      titleId: {
        field: 'solicitudIdTitulo',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      generatedAt: {
        field: 'solicitudFechaGeneracion',
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'solicitud',
      timestamps: false,
      freezeTableName: true
    }
  );

  return request;
};
