module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TitleStatus', {
      idTitleStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      titleStatusName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      titleStatusDescription: {
        type: Sequelize.STRING(100),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('TitleStatus');
  }
};
