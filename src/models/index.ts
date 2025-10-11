import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { initTitleModel, TitleModel } from './title';
import { initFacultyModel, FacultyModel } from './faculty';
import {
  initAcademicProgramModel,
  AcademicProgramModel
} from './academicProgram';
import { initStudyPlanModel, StudyPlanModel } from './studyPlan';

const title = initTitleModel(sequelize);
const faculty = initFacultyModel(sequelize);
const academicProgram = initAcademicProgramModel(sequelize);
const studyPlan = initStudyPlanModel(sequelize);

faculty.hasMany(academicProgram, {
  foreignKey: 'idFaculty',
  as: 'academicPrograms'
});

academicProgram.belongsTo(faculty, {
  foreignKey: 'idFaculty',
  as: 'faculty'
});

academicProgram.hasMany(studyPlan, {
  foreignKey: 'idAcademicProgram',
  as: 'studyPlans'
});

studyPlan.belongsTo(academicProgram, {
  foreignKey: 'idAcademicProgram',
  as: 'academicProgram'
});

studyPlan.hasMany(title, {
  foreignKey: 'idStudyPlan',
  as: 'titles'
});

title.belongsTo(studyPlan, {
  foreignKey: 'idStudyPlan',
  as: 'studyPlan'
});

const models = {
  title,
  faculty,
  academicProgram,
  studyPlan
};

type DbModels = typeof models;

export type {
  DbModels,
  TitleModel,
  FacultyModel,
  AcademicProgramModel,
  StudyPlanModel
};
export { sequelize };
export default models;
