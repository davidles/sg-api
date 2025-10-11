import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequirementAttributes,
  RequirementCreationAttributes
} from '../types/requirement';

export type RequirementInstance = Model<
  RequirementAttributes,
  RequirementCreationAttributes
>;
export type RequirementModel = ModelCtor<RequirementInstance>;

export const initRequirementModel = (sequelize: Sequelize): RequirementModel => {
  const requirement = sequelize.define<RequirementInstance>(
    'Requirement',
    {
      idRequirement: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      requirementDescription: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
      }
    },
    {
      tableName: 'Requirement',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requirement;
};
