import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { FacultyAttributes, FacultyCreationAttributes } from '../types/faculty';

export type FacultyInstance = Model<FacultyAttributes, FacultyCreationAttributes>;
export type FacultyModel = ModelCtor<FacultyInstance>;

export const initFacultyModel = (sequelize: Sequelize): FacultyModel => {
  const faculty = sequelize.define<FacultyInstance>(
    'Faculty',
    {
      idFaculty: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      facultyName: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      tableName: 'Faculty',
      timestamps: false,
      freezeTableName: true
    }
  );

  return faculty;
};
