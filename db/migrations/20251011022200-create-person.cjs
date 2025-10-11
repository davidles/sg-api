module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Person', {
      idPerson: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      personNationalId: {
        type: Sequelize.STRING(8),
        allowNull: true,
        unique: true
      },
      birthDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      idNationality: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Country',
          key: 'idCountry'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idBirthCity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'City',
          key: 'idCity'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      idResidenceCity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'City',
          key: 'idCity'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Person');
  }
};
