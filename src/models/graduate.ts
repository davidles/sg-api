import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { GraduateAttributes, GraduateCreationAttributes } from '../types/graduate';

export type GraduateInstance = Model<GraduateAttributes, GraduateCreationAttributes>;
export type GraduateModel = ModelCtor<GraduateInstance>;

export const initGraduateModel = (sequelize: Sequelize): GraduateModel => {
  const graduate = sequelize.define<GraduateInstance>(
    'Graduate',
    {
      idGraduate: {
        field: 'idEgresado',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      personId: {
        field: 'idEgresado_Persona',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      militaryRankId: {
        field: 'idEgresado_Grado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      },
      graduateType: {
        field: 'egresadoTipo',
        type: DataTypes.ENUM('Civil', 'Militar'),
        allowNull: true
      }
    },
    {
      tableName: 'egresado',
      timestamps: false,
      freezeTableName: true
    }
  );

  return graduate;
};
