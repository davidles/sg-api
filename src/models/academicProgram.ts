import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  AcademicProgramAttributes,
  AcademicProgramCreationAttributes
} from '../types/academicProgram';

export type AcademicProgramInstance = Model<AcademicProgramAttributes, AcademicProgramCreationAttributes>;
export type AcademicProgramModel = ModelCtor<AcademicProgramInstance>;

export const initAcademicProgramModel = (sequelize: Sequelize): AcademicProgramModel => {
  const academicProgram = sequelize.define<AcademicProgramInstance>(
    'AcademicProgram',
    {
      idAcademicProgram: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      academicProgramName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      idFaculty: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'AcademicProgram',
      timestamps: false,
      freezeTableName: true
    }
  );

  return academicProgram;
};
