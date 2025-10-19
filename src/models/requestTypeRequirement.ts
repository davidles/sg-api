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
      requestTypeId: {
        field: 'idTipoSolicitud',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      requirementId: {
        field: 'idRequisito',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true
      },
      isRequired: {
        field: 'requisitoObligatorio',
        type: DataTypes.TINYINT,
        allowNull: true
      }
    },
    {
      tableName: 'tipoSolicitudRequisito',
      timestamps: false,
      freezeTableName: true
    }
  );

  return requestTypeRequirement;
};
