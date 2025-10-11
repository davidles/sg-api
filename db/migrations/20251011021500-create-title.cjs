module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Title', {
      idTitle: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      idStudyPlan: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'StudyPlan',
          key: 'idStudyPlan'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      titleName: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      idTitleStatus: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'TitleStatus',
          key: 'idTitleStatus'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idRequestType: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'RequestType',
          key: 'idRequestType'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Title');
  }
};
