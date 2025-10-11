module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRole', {
      idUser: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'UserAccount',
          key: 'idUser'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idRole: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Role',
          key: 'idRole'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('UserRole');
  }
};
