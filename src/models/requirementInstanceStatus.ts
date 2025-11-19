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
        field: 'idRequisitoInstandiaEstado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementInstanceStatusName: {
        field: 'requisitoInstanciaNombre',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      requirementInstanceStatusDescription: {
        field: 'requisitoInstanciaDescripcion',
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'requisitoInstaciaEstado',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requirementInstanceStatus;
};
