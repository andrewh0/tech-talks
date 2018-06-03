// @flow

import db from '../models';
import { Op } from 'sequelize';
import { get } from 'lodash';
const { Video } = db;

const LIMIT = 50;

// TODO remove -- this should already be on the record by this point
const hideIds = videos =>
  videos.map(video => ({
    ...video.dataValues,
    id: Video.encodeId(video.id)
  }));

export const getRecent = (_req, res) =>
  Video.findAll({
    order: [['videoPublishedAt', 'DESC']],
    limit: LIMIT
  })
    .then(videos => res.status(200).json(hideIds(videos)))
    .catch(error => res.status(400).json(error));

export const getMostViewed = (_req, res) =>
  Video.findAll({
    order: [['views', 'DESC']],
    limit: LIMIT
  })
    .then(videos => res.status(200).json(hideIds(videos)))
    .catch(error => {
      return res.status(400).json(error);
    });

export const getShort = (_req, res) =>
  Video.findAll({
    where: {
      duration: {
        [Op.lte]: 600
      }
    }
  })
    .then(videos => res.status(200).json(hideIds(videos)))
    .catch(error => res.status(400).json(error));

export const getVideo = (req, res) => {
  const techTalkVideoId = get(req, ['params', 'techTalkVideoId']);
  if (techTalkVideoId) {
    return Video.findOne({ where: { techTalkVideoId } })
      .then(({ videoId }) => res.status(200).json({ videoId }))
      .catch(error => res.status(400).json(error));
  }
  return res.status(400);
};
