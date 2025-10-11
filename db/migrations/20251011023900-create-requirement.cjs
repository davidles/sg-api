module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Requirement', {
      idRequirement: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      requirementDescription: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Requirement');
  }
};
