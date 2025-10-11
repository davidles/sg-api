module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestStatusHistory', {
      idRequest: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Request',
          key: 'idRequest'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idRequestStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'RequestStatus',
          key: 'idRequestStatus'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      statusStartDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        primaryKey: true
      },
      statusEndDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    }, {
      id: false,
      timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequestStatusHistory');
  }
};
