module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ForceBranch', {
      idForceBranch: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      forceBranchName: {
        type: Sequelize.STRING(45),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ForceBranch');
  }
};
