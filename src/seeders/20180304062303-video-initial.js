const { videoHashId } = require('../helpers/hashIds');
const videoData = require('../../data.json');

module.exports = {
  up: function(queryInterface, _Sequelize) {
    return queryInterface.bulkInsert(
      'Videos',
      videoData.map((video, i) => ({
        ...video,
        id: i,
        techTalkVideoId: videoHashId.encode(i),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    );
  },

  down: function(queryInterface, _Sequelize) {
    return queryInterface.bulkDelete('Videos', null, {});
  }
};
