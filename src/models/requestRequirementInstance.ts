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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idRequest: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      idRequirement: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      idCompletedByUser: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      completedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      idVerifiedByUser: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      verifiedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      idCurrentRequirementStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      complianceVersion: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      reviewReason: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      }
    },
    {
      tableName: 'RequestRequirementInstance',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestRequirementInstance;
};
