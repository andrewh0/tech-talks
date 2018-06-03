module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      source: {
        allowNull: false,
        type: Sequelize.STRING
      },
      thumbnailUrl: {
        allowNull: false,
        type: Sequelize.STRING
      },
      thumbnailHeight: {
        type: Sequelize.INTEGER
      },
      thumbnailWidth: {
        type: Sequelize.INTEGER
      },
      videoId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      videoPublishedAt: {
        type: Sequelize.INTEGER
      },
      techTalkVideoId: {
        type: Sequelize.STRING
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      eventName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      eventType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      eventLocation: {
        type: Sequelize.STRING
      },
      views: {
        type: Sequelize.INTEGER
      },
      duration: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface, _Sequelize) => queryInterface.dropTable('Videos')
};
