module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VerificationResult', {
      idVerificationResult: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      verificationResultName: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      verificationResultDescription: {
        type: Sequelize.STRING(45),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('VerificationResult');
  }
};
