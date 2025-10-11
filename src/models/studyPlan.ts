import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { StudyPlanAttributes, StudyPlanCreationAttributes } from '../types/studyPlan';

export type StudyPlanInstance = Model<StudyPlanAttributes, StudyPlanCreationAttributes>;
export type StudyPlanModel = ModelCtor<StudyPlanInstance>;

export const initStudyPlanModel = (sequelize: Sequelize): StudyPlanModel => {
  const studyPlan = sequelize.define<StudyPlanInstance>(
    'StudyPlan',
    {
      idStudyPlan: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      studyPlanName: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      idAcademicProgram: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'StudyPlan',
      timestamps: false,
      freezeTableName: true
    }
  );

  return studyPlan;
};
