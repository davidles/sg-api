import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  RequirementInstanceStatusAttributes,
  RequirementInstanceStatusCreationAttributes
} from '../types/requirementInstanceStatus';

export type RequirementInstanceStatusInstance = Model<
  RequirementInstanceStatusAttributes,
  RequirementInstanceStatusCreationAttributes
>;
export type RequirementInstanceStatusModel = ModelCtor<RequirementInstanceStatusInstance>;

export const initRequirementInstanceStatusModel = (
  sequelize: Sequelize
): RequirementInstanceStatusModel => {
  const requirementInstanceStatus = sequelize.define<RequirementInstanceStatusInstance>(
    'RequirementInstanceStatus',
    {
      idRequirementInstanceStatus: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementInstanceStatusName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      requirementInstanceStatusDescription: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'RequirementInstanceStatus',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requirementInstanceStatus;
};
