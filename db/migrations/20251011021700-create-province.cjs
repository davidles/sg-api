module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Province', {
      idProvince: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      provinceName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      idCountry: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Country',
          key: 'idCountry'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Province');
  }
};
