import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { initTitleModel, TitleModel } from './title';
import { initFacultyModel, FacultyModel } from './faculty';
import {
  initAcademicProgramModel,
  AcademicProgramModel
} from './academicProgram';
import { initStudyPlanModel, StudyPlanModel } from './studyPlan';
import { initTitleStatusModel, TitleStatusModel } from './titleStatus';
import { initRequestTypeModel, RequestTypeModel } from './requestType';

const title = initTitleModel(sequelize);
const faculty = initFacultyModel(sequelize);
const academicProgram = initAcademicProgramModel(sequelize);
const studyPlan = initStudyPlanModel(sequelize);
const titleStatus = initTitleStatusModel(sequelize);
const requestType = initRequestTypeModel(sequelize);

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

title.belongsTo(titleStatus, {
  foreignKey: 'idTitleStatus',
  as: 'titleStatus'
});

title.belongsTo(requestType, {
  foreignKey: 'idRequestType',
  as: 'requestType'
});

const models = {
  title,
  faculty,
  academicProgram,
  studyPlan,
  titleStatus,
  requestType
};

type DbModels = typeof models;

export type {
  DbModels,
  TitleModel,
  FacultyModel,
  AcademicProgramModel,
  StudyPlanModel,
  TitleStatusModel,
  RequestTypeModel
};
export { sequelize };
export default models;
