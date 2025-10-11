module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProcessStage', {
      idProcessStage: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idControlLevel: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'ControlLevel',
          key: 'idControlLevel'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      processStageName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      processStageDescription: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      processStageOrder: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProcessStage');
  }
};
