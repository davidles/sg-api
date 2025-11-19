import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import {
  EnrollmentAttributes,
  EnrollmentCreationAttributes
} from '../types/enrollment';

export type EnrollmentInstance = Model<EnrollmentAttributes, EnrollmentCreationAttributes>;
export type EnrollmentModel = ModelCtor<EnrollmentInstance>;

export const initEnrollmentModel = (sequelize: Sequelize): EnrollmentModel => {
  const enrollment = sequelize.define<EnrollmentInstance>(
    'Enrollment',
    {
      graduateId: {
        field: 'cursaIdEgresado',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        primaryKey: true
      },
      academicProgramId: {
        field: 'cursaIdCarrera',
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        primaryKey: true
      },
      enrollmentDate: {
        field: 'fechaInscripcionCarrera',
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      completionDate: {
        field: 'fechaFinalCarrera',
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'cursa',
      timestamps: false,
      freezeTableName: true
    }
  );

  return enrollment;
};
