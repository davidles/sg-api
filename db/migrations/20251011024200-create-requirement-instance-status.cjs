module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequirementInstanceStatus', {
      idRequirementInstanceStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requirementInstanceStatusName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      requirementInstanceStatusDescription: {
        type: Sequelize.STRING(50),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequirementInstanceStatus');
  }
};
