module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAccount', {
      idUser: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idPerson: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Person',
          key: 'idPerson'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
      username: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      accountStatus: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PENDING'),
        allowNull: false,
        defaultValue: 'PENDING'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UserAccount');
  }
};
