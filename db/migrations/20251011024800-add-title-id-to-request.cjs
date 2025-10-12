module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Request', 'idTitle', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Title',
        key: 'idTitle'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Request', 'idTitle');
  }
};
