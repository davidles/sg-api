import { sequelize } from '../config/database';
import models from '../models';
import { findAvailableTitlesForUser } from '../services/requestService';

describe('findAvailableTitlesForUser', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const faculty = await models.faculty.create({
      facultyName: 'Faculty Test'
    });

    const academicProgram = await models.academicProgram.create({
      academicProgramName: 'Program Test',
      idFaculty: faculty.getDataValue('idFaculty')
    });

    const studyPlan = await models.studyPlan.create({
      studyPlanName: 'Plan Test',
      careerId: academicProgram.getDataValue('idAcademicProgram')
    });

    const titleStatus = await models.titleStatus.create({
      titleStatusName: 'Pendiente'
    });

    const requestType = await models.requestType.create({
      requestTypeName: 'Grado'
    });

    await models.title.create({
      studyPlanId: studyPlan.getDataValue('idStudyPlan'),
      titleName: 'Título de Prueba',
      requestTypeId: requestType.getDataValue('idRequestType'),
      titleStatusId: titleStatus.getDataValue('idTitleStatus')
    });

    const person = await models.person.create({
      lastName: 'Test',
      firstName: 'User',
      documentNumber: '12345678'
    });

    const graduate = await models.graduate.create({
      personId: person.getDataValue('idPerson'),
      graduateType: 'Civil'
    });

    await models.user.create({
      personId: person.getDataValue('idPerson'),
      username: 'test@example.com',
      accountType: 'ACTIVA',
      password: 'hashed',
      roleId: 1
    });

    await models.enrollment.create({
      graduateId: graduate.getDataValue('idGraduate'),
      academicProgramId: academicProgram.getDataValue('idAcademicProgram')
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('debería devolver títulos disponibles para el usuario', async () => {
    const titles = await findAvailableTitlesForUser(1);

    expect(titles).toHaveLength(1);
    expect(titles[0].titleName).toBe('Título de Prueba');
    expect(titles[0].academicProgramName).toBe('Program Test');
  });
});
