module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Request', {
      idRequest: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idUser: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'UserAccount',
          key: 'idUser'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idRequestType: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'RequestType',
          key: 'idRequestType'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      generatedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Request');
  }
};
