module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('TitleStatus', [
      {
        idTitleStatus: 1,
        titleStatusName: 'Pending Review',
        titleStatusDescription: 'Awaiting validation'
      },
      {
        idTitleStatus: 2,
        titleStatusName: 'Approved',
        titleStatusDescription: 'Request approved and ready for issuance'
      },
      {
        idTitleStatus: 3,
        titleStatusName: 'Rejected',
        titleStatusDescription: 'Request rejected'
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('TitleStatus', {
      idTitleStatus: [1, 2, 3]
    });
  }
};
