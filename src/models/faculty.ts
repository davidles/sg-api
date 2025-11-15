import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { FacultyAttributes, FacultyCreationAttributes } from '../types/faculty';

export type FacultyInstance = Model<FacultyAttributes, FacultyCreationAttributes>;
export type FacultyModel = ModelCtor<FacultyInstance>;

export const initFacultyModel = (sequelize: Sequelize): FacultyModel => {
  const faculty = sequelize.define<FacultyInstance>(
    'Faculty',
    {
      idFaculty: {
        field: 'idFacultad',
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      facultyName: {
        field: 'facultadNombre',
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      tableName: 'facultad',
      timestamps: false,
      freezeTableName: true
    }
  );

  return faculty;
};
