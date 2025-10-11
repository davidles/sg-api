module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contact', {
      idContact: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      mobilePhone: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      emailAddress: {
        type: Sequelize.STRING(45),
        allowNull: true
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
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Contact');
  }
};
