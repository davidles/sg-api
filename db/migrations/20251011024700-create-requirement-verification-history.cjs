module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequirementVerificationHistory', {
      idRequirementVerificationHistory: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idRequestRequirementInstance: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'RequestRequirementInstance',
          key: 'idRequestRequirementInstance'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idProcessStage: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'ProcessStage',
          key: 'idProcessStage'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idVerifiedByUser: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'UserAccount',
          key: 'idUser'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idVerificationResult: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'VerificationResult',
          key: 'idVerificationResult'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      verifiedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequirementVerificationHistory');
  }
};
