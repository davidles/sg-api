module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RequestTypeRequirement', {
      idRequestType: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'RequestType',
          key: 'idRequestType'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      idRequirement: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Requirement',
          key: 'idRequirement'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      isRequired: {
        type: Sequelize.TINYINT,
        allowNull: true
      }
    }, {
      id: false,
      timestamps: false
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('RequestTypeRequirement');
  }
};
