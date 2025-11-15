import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequestRequirementInstanceAttributes,
  RequestRequirementInstanceCreationAttributes
} from '../types/requestRequirementInstance';

export type RequestRequirementInstanceInstance = Model<
  RequestRequirementInstanceAttributes,
  RequestRequirementInstanceCreationAttributes
>;
export type RequestRequirementInstanceModel = ModelCtor<RequestRequirementInstanceInstance>;

export const initRequestRequirementInstanceModel = (
  sequelize: Sequelize
): RequestRequirementInstanceModel => {
  const requestRequirementInstance = sequelize.define<RequestRequirementInstanceInstance>(
    'RequestRequirementInstance',
    {
      idRequestRequirementInstance: {
        field: 'idSolicitudRequisitoInstancia',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requestId: {
        field: 'instanciaIdSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requirementId: {
        field: 'instanciaIdRequisito',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completedByUserId: {
        field: 'instanciaIdUsuarioCompletador',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completedAt: {
        field: 'fechaCompletado',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      verifiedByUserId: {
        field: 'instanciaIdUsuarioVerificador',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      verifiedAt: {
        field: 'fechaVerificacion',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      currentRequirementStatusId: {
        field: 'idRequisitoInstancia_EstadoActual',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completionVersion: {
        field: 'VersionCompletada',
        type: DataTypes.INTEGER,
        allowNull: true
      },
      reviewReason: {
        field: 'MotivoRevision',
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      requirementFilePath: {
        field: 'requirementFilePath',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      fileBlob: {
        field: 'archivo',
        type: DataTypes.BLOB,
        allowNull: true
      }
    },
    {
      tableName: 'solicitudRequisitoInstancia',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestRequirementInstance;
};
