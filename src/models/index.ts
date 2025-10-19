import { Sequelize } from 'sequelize';
import { sequelize } from '../config/database';
import { initTitleModel, TitleModel } from './title';
import { initFacultyModel, FacultyModel } from './faculty';
import { initAcademicProgramModel, AcademicProgramModel } from './academicProgram';
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
import { initPersonModel, PersonModel } from './person';
import { initGraduateModel, GraduateModel } from './graduate';
import { initUserModel, UserModel } from './user';
import { initContactModel, ContactModel } from './contact';
import { initAddressModel, AddressModel } from './address';
import { initCityModel, CityModel } from './city';
import { initProvinceModel, ProvinceModel } from './province';
import { initCountryModel, CountryModel } from './country';
import { initForceModel, ForceModel } from './force';
import { initMilitaryRankModel, MilitaryRankModel } from './militaryRank';

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
const person = initPersonModel(sequelize);
const graduate = initGraduateModel(sequelize);
const user = initUserModel(sequelize);
const contact = initContactModel(sequelize);
const address = initAddressModel(sequelize);
const city = initCityModel(sequelize);
const province = initProvinceModel(sequelize);
const country = initCountryModel(sequelize);
const force = initForceModel(sequelize);
const militaryRank = initMilitaryRankModel(sequelize);

faculty.hasMany(academicProgram, {
  foreignKey: 'idFaculty',
  as: 'academicPrograms'
});

academicProgram.belongsTo(faculty, {
  foreignKey: 'idFaculty',
  as: 'faculty'
});

academicProgram.hasMany(studyPlan, {
  foreignKey: 'careerId',
  as: 'studyPlans'
});

studyPlan.belongsTo(academicProgram, {
  foreignKey: 'careerId',
  as: 'academicProgram'
});

studyPlan.hasMany(title, {
  foreignKey: 'studyPlanId',
  as: 'titles'
});

title.belongsTo(studyPlan, {
  foreignKey: 'studyPlanId',
  as: 'studyPlan'
});

title.belongsTo(titleStatus, {
  foreignKey: 'titleStatusId',
  as: 'titleStatus'
});

title.belongsTo(requestType, {
  foreignKey: 'requestTypeId',
  as: 'requestType'
});

request.belongsTo(requestType, {
  foreignKey: 'requestTypeId',
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
  foreignKey: 'requestId',
  as: 'request'
});

requestRequirementInstance.belongsTo(requirement, {
  foreignKey: 'requirementId',
  as: 'requirement'
});

requestRequirementInstance.belongsTo(requirementInstanceStatus, {
  foreignKey: 'currentRequirementStatusId',
  as: 'status'
});

request.hasMany(requestRequirementInstance, {
  foreignKey: 'requestId',
  as: 'requirementInstances'
});

requestType.hasMany(requestTypeRequirement, {
  foreignKey: 'requestTypeId',
  as: 'requirements'
});

requestTypeRequirement.belongsTo(requestType, {
  foreignKey: 'requestTypeId',
  as: 'requestType'
});

requestTypeRequirement.belongsTo(requirement, {
  foreignKey: 'requirementId',
  as: 'requirement'
});

person.hasOne(graduate, {
  foreignKey: 'personId',
  as: 'graduate'
});

graduate.belongsTo(person, {
  foreignKey: 'personId',
  as: 'person'
});

person.hasOne(user, {
  foreignKey: 'personId',
  as: 'user'
});

user.belongsTo(person, {
  foreignKey: 'personId',
  as: 'person'
});

person.hasOne(contact, {
  foreignKey: 'personId',
  as: 'contact'
});

contact.belongsTo(person, {
  foreignKey: 'personId',
  as: 'person'
});

person.hasOne(address, {
  foreignKey: 'personId',
  as: 'address'
});

address.belongsTo(person, {
  foreignKey: 'personId',
  as: 'person'
});

city.hasMany(address, {
  foreignKey: 'cityId',
  as: 'addresses'
});

address.belongsTo(city, {
  foreignKey: 'cityId',
  as: 'city'
});

province.hasMany(city, {
  foreignKey: 'provinceId',
  as: 'cities'
});

city.belongsTo(province, {
  foreignKey: 'provinceId',
  as: 'province'
});

country.hasMany(province, {
  foreignKey: 'countryId',
  as: 'provinces'
});

province.belongsTo(country, {
  foreignKey: 'countryId',
  as: 'country'
});

force.hasMany(militaryRank, {
  foreignKey: 'forceId',
  as: 'militaryRanks'
});

militaryRank.belongsTo(force, {
  foreignKey: 'forceId',
  as: 'force'
});

militaryRank.hasMany(graduate, {
  foreignKey: 'militaryRankId',
  as: 'graduates'
});

graduate.belongsTo(militaryRank, {
  foreignKey: 'militaryRankId',
  as: 'militaryRank'
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
  requestTypeRequirement,
  person,
  graduate,
  user,
  contact,
  address,
  city,
  province,
  country,
  force,
  militaryRank
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
  RequestTypeRequirementModel,
  PersonModel,
  GraduateModel,
  UserModel,
  ContactModel,
  AddressModel,
  CityModel,
  ProvinceModel,
  CountryModel,
  ForceModel,
  MilitaryRankModel
};
export { sequelize };
export default models;
