module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MilitaryRank', {
      idMilitaryRank: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      militaryRankName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      idForceBranch: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'ForceBranch',
          key: 'idForceBranch'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('MilitaryRank');
  }
};
