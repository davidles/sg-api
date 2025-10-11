module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Country', {
      idCountry: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      countryName: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Country');
  }
};
