module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('requestrequirementinstance', 'requirementFilePath', {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'reviewReason'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('requestrequirementinstance', 'requirementFilePath');
  }
};
