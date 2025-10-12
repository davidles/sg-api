import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequestTypeRequirementAttributes,
  RequestTypeRequirementCreationAttributes
} from '../types/requestTypeRequirement';

export type RequestTypeRequirementInstance = Model<
  RequestTypeRequirementAttributes,
  RequestTypeRequirementCreationAttributes
>;
export type RequestTypeRequirementModel = ModelCtor<RequestTypeRequirementInstance>;

export const initRequestTypeRequirementModel = (
  sequelize: Sequelize
): RequestTypeRequirementModel => {
  const requestTypeRequirement = sequelize.define<RequestTypeRequirementInstance>(
    'RequestTypeRequirement',
    {
      idRequestType: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      idRequirement: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      isRequired: {
        type: DataTypes.TINYINT,
        allowNull: true
      }
    },
    {
      tableName: 'RequestTypeRequirement',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestTypeRequirement;
};
