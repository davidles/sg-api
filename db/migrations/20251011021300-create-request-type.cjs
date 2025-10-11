module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestType', {
      idRequestType: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      requestTypeName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      requestTypeDescription: {
        type: Sequelize.STRING(100),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequestType');
  }
};
