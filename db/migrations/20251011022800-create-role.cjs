module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Role', {
      idRole: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      roleName: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Role');
  }
};
