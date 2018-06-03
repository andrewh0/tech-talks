// @flow

import { videoHashId } from '../helpers/hashids';

const Video = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    source: DataTypes.STRING,
    thumbnailUrl: DataTypes.STRING,
    thumbnailHeight: DataTypes.INTEGER,
    thumbnailWidth: DataTypes.INTEGER,
    videoId: DataTypes.STRING,
    videoPublishedAt: DataTypes.INTEGER,
    techTalkVideoId: DataTypes.STRING,
    year: DataTypes.INTEGER,
    eventName: DataTypes.STRING,
    eventType: DataTypes.STRING,
    eventLocation: DataTypes.STRING,
    views: DataTypes.INTEGER,
    duration: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  Video.encodeId = function(id) {
    return videoHashId.encode(id);
  };

  Video.decodeId = function(encodedId) {
    return videoHashId.decode(encodedId)[0];
  };

  return Video;
};

export default Video;
