module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ControlLevel', [
      {
        idControlLevel: 1,
        controlLevelName: 'Reception',
        controlLevelDescription: 'Initial intake level',
        permissions: JSON.stringify({ canReview: false, canApprove: false })
      },
      {
        idControlLevel: 2,
        controlLevelName: 'Academic Review',
        controlLevelDescription: 'Academic validation level',
        permissions: JSON.stringify({ canReview: true, canApprove: false })
      },
      {
        idControlLevel: 3,
        controlLevelName: 'Secretary Approval',
        controlLevelDescription: 'Final secretary approval level',
        permissions: JSON.stringify({ canReview: true, canApprove: true })
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ControlLevel', {
      idControlLevel: [1, 2, 3]
    });
  }
};
