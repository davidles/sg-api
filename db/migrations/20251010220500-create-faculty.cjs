module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Faculty', {
      idFaculty: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      facultyName: {
        type: Sequelize.STRING(100),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Faculty');
  }
};
