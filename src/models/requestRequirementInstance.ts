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
        field: 'idRequestRequirementInstance',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requestId: {
        field: 'idRequest',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      requirementId: {
        field: 'idRequirement',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completedByUserId: {
        field: 'idCompletedByUser',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completedAt: {
        field: 'completedAt',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      verifiedByUserId: {
        field: 'idVerifiedByUser',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      verifiedAt: {
        field: 'verifiedAt',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      currentRequirementStatusId: {
        field: 'idCurrentRequirementStatus',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      complianceVersion: {
        field: 'complianceVersion',
        type: DataTypes.INTEGER,
        allowNull: true
      },
      reviewReason: {
        field: 'reviewReason',
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      requirementFilePath: {
        field: 'requirementFilePath',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'requestrequirementinstance',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestRequirementInstance;
};
