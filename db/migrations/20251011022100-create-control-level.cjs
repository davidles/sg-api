module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ControlLevel', {
      idControlLevel: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      controlLevelName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      controlLevelDescription: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ControlLevel');
  }
};
