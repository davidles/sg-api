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
        field: 'idRequisito',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementName: {
        field: 'requisitoNombre',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      requirementDescription: {
        field: 'requisitoDescripcion',
        type: DataTypes.TEXT('medium'),
        allowNull: true
      }
    },
    {
      tableName: 'requisito',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requirement;
};
