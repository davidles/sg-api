import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { StudyPlanAttributes, StudyPlanCreationAttributes } from '../types/studyPlan';

export type StudyPlanInstance = Model<StudyPlanAttributes, StudyPlanCreationAttributes>;
export type StudyPlanModel = ModelCtor<StudyPlanInstance>;

export const initStudyPlanModel = (sequelize: Sequelize): StudyPlanModel => {
  const studyPlan = sequelize.define<StudyPlanInstance>(
    'StudyPlan',
    {
      idStudyPlan: {
        field: 'idPlanEstudio',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      studyPlanName: {
        field: 'planEstudioNombre',
        type: DataTypes.STRING(255),
        allowNull: true
      },
      careerId: {
        field: 'planEstudioIdCarrera',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'planEstudio',
      timestamps: false,
      freezeTableName: true
    }
  );

  return studyPlan;
};
