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
        field: 'idCarrera',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      academicProgramName: {
        field: 'carreraNombre',
        type: DataTypes.STRING(100),
        allowNull: false
      },
      idFaculty: {
        field: 'carreraIdFacultad',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true
      }
    },
    {
      tableName: 'carrera',
      timestamps: false,
      freezeTableName: true
    }
  );

  return academicProgram;
};
