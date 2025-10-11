module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('RequestType', [
      {
        idRequestType: 1,
        requestTypeName: 'Diploma Issuance',
        requestTypeDescription: 'Request to issue a graduate diploma'
      },
      {
        idRequestType: 2,
        requestTypeName: 'Certificate Reprint',
        requestTypeDescription: 'Request to reprint an existing certificate'
      },
      {
        idRequestType: 3,
        requestTypeName: 'Record Update',
        requestTypeDescription: 'Request to update academic records'
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('RequestType', {
      idRequestType: [1, 2, 3]
    });
  }
};
