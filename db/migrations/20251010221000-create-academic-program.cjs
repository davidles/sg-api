module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AcademicProgram', {
      idAcademicProgram: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      academicProgramName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      idFaculty: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Faculty',
          key: 'idFaculty'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('AcademicProgram');
  }
};
