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
import { initRequestModel, RequestModel } from './request';
import { initRequestStatusModel, RequestStatusModel } from './requestStatus';
import {
  initRequestStatusHistoryModel,
  RequestStatusHistoryModel
} from './requestStatusHistory';
import { initRequirementModel, RequirementModel } from './requirement';
import {
  initRequestRequirementInstanceModel,
  RequestRequirementInstanceModel
} from './requestRequirementInstance';
import {
  initRequirementInstanceStatusModel,
  RequirementInstanceStatusModel
} from './requirementInstanceStatus';
import {
  initRequestTypeRequirementModel,
  RequestTypeRequirementModel
} from './requestTypeRequirement';

const title = initTitleModel(sequelize);
const faculty = initFacultyModel(sequelize);
const academicProgram = initAcademicProgramModel(sequelize);
const studyPlan = initStudyPlanModel(sequelize);
const titleStatus = initTitleStatusModel(sequelize);
const requestType = initRequestTypeModel(sequelize);
const request = initRequestModel(sequelize);
const requestStatus = initRequestStatusModel(sequelize);
const requestStatusHistory = initRequestStatusHistoryModel(sequelize);
const requirement = initRequirementModel(sequelize);
const requirementInstanceStatus = initRequirementInstanceStatusModel(sequelize);
const requestRequirementInstance = initRequestRequirementInstanceModel(sequelize);
const requestTypeRequirement = initRequestTypeRequirementModel(sequelize);

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

title.hasMany(request, {
  foreignKey: 'idTitle',
  as: 'requests'
});

request.belongsTo(title, {
  foreignKey: 'idTitle',
  as: 'title'
});

request.belongsTo(requestType, {
  foreignKey: 'idRequestType',
  as: 'requestType'
});

requestStatusHistory.belongsTo(request, {
  foreignKey: 'idRequest',
  as: 'request'
});

requestStatusHistory.belongsTo(requestStatus, {
  foreignKey: 'idRequestStatus',
  as: 'status'
});

request.hasMany(requestStatusHistory, {
  foreignKey: 'idRequest',
  as: 'statusHistory'
});

requestRequirementInstance.belongsTo(request, {
  foreignKey: 'idRequest',
  as: 'request'
});

requestRequirementInstance.belongsTo(requirement, {
  foreignKey: 'idRequirement',
  as: 'requirement'
});

requestRequirementInstance.belongsTo(requirementInstanceStatus, {
  foreignKey: 'idCurrentRequirementStatus',
  as: 'status'
});

request.hasMany(requestRequirementInstance, {
  foreignKey: 'idRequest',
  as: 'requirementInstances'
});

requestType.hasMany(requestTypeRequirement, {
  foreignKey: 'idRequestType',
  as: 'requirements'
});

requestTypeRequirement.belongsTo(requestType, {
  foreignKey: 'idRequestType',
  as: 'requestType'
});

requestTypeRequirement.belongsTo(requirement, {
  foreignKey: 'idRequirement',
  as: 'requirement'
});

const models = {
  title,
  faculty,
  academicProgram,
  studyPlan,
  titleStatus,
  requestType,
  request,
  requestStatus,
  requestStatusHistory,
  requirement,
  requirementInstanceStatus,
  requestRequirementInstance,
  requestTypeRequirement
};

type DbModels = typeof models;

export type {
  DbModels,
  TitleModel,
  FacultyModel,
  AcademicProgramModel,
  StudyPlanModel,
  TitleStatusModel,
  RequestTypeModel,
  RequestModel,
  RequestStatusModel,
  RequestStatusHistoryModel,
  RequirementModel,
  RequirementInstanceStatusModel,
  RequestRequirementInstanceModel,
  RequestTypeRequirementModel
};
export { sequelize };
export default models;
