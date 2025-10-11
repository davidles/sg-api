module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('City', {
      idCity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      cityName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      idProvince: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Province',
          key: 'idProvince'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('City');
  }
};
