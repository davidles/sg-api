module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestRequirementInstance', {
      idRequestRequirementInstance: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idRequest: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Request',
          key: 'idRequest'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idRequirement: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Requirement',
          key: 'idRequirement'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idCompletedByUser: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'UserAccount',
          key: 'idUser'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      completedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true
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
      verifiedAt: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      idCurrentRequirementStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'RequirementInstanceStatus',
          key: 'idRequirementInstanceStatus'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      complianceVersion: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      reviewReason: {
        type: Sequelize.TEXT('long'),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequestRequirementInstance');
  }
};
