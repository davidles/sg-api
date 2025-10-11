module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Graduate', {
      idGraduate: {
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
      graduateType: {
        type: Sequelize.ENUM('TYPE_A', 'TYPE_B'),
        allowNull: true
      },
      idMilitaryRank: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'MilitaryRank',
          key: 'idMilitaryRank'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Graduate');
  }
};
