module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestStatus', {
      idRequestStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idProcessStage: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'ProcessStage',
          key: 'idProcessStage'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      requestStatusName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      requestStatusDescription: {
        type: Sequelize.STRING(100),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequestStatus');
  }
};
