import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { ForceAttributes, ForceCreationAttributes } from '../types/force';

export type ForceInstance = Model<ForceAttributes, ForceCreationAttributes>;
export type ForceModel = ModelCtor<ForceInstance>;

export const initForceModel = (sequelize: Sequelize): ForceModel => {
  const force = sequelize.define<ForceInstance>(
    'Force',
    {
      idForce: {
        field: 'idFuerzaMilitar',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      forceName: {
        field: 'fuerzaNombre',
        type: DataTypes.STRING(45),
        allowNull: true
      }
    },
    {
      tableName: 'fuerza_militar',
      timestamps: false,
      freezeTableName: true
    }
  );

  return force;
};
