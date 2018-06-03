// @flow

import algoliasearch from 'algoliasearch';
import { ALGOLIA_APP_ID, ALGOLIA_SECRET_ADMIN_KEY } from '../../config/secrets';
import db from '../models';
import { chunk, omit, get } from 'lodash';
import queryString from 'query-string';
import fetch from 'node-fetch';
const { YOUTUBE_API_KEY } = require('../../config/secrets');

const { Video } = db;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SECRET_ADMIN_KEY);
const index = client.initIndex('dev_SAMPLE_VIDEOS');
const youtubeApiBase = 'https://www.googleapis.com/youtube/v3';

const HOURS_TO_MS = 1000 * 60 * 60;
const VIDEO_INDEX_FREQUENCY_HOURS = 24 * HOURS_TO_MS;

const useIdAsAlgoliaObjectId = videos =>
  videos.map(video => ({
    ...omit(video, 'id'),
    objectID: video.id
  }));

// this is the same as videosFromIds() from ../helpers/videosFromPlaylists, but webpack
function videosFromIds(videoIds, parts) {
  const maxResults = 50;
  const queryParams = {
    id: videoIds.join(','),
    key: YOUTUBE_API_KEY,
    part: parts.join(','),
    maxResults
  };
  const queryParamString = queryString.stringify(queryParams);
  return fetch(`${youtubeApiBase}/videos?${queryParamString}`)
    .then(response => response.json())
    .catch(error => {
      console.error(`Error fetching video data from videoIds`, error); // eslint-disable-line no-console
    });
}

// TODO: Probably better to add videos to a queue and process them individually
// to avoid opening up too many connections at a time.
function indexVideos() {
  Video.findAll({ raw: true }).then(async videos => {
    const videosWithUpdatedViews = await Promise.all(
      videos.map(async video => {
        const result = await videosFromIds([video.videoId], ['statistics']);
        const views = Number(
          get(result, ['items', 0, 'statistics', 'viewCount'])
        );
        return {
          ...video,
          views: views || video.views
        };
      })
    );

    const chunks = chunk(useIdAsAlgoliaObjectId(videosWithUpdatedViews), 1000);
    chunks.map(batch =>
      index.addObjects(batch, (err, _content) => {
        if (err) {
          console.warn(err); // eslint-disable-line no-console
          return;
        }
      })
    );
    return videosWithUpdatedViews;
  });
}

export default indexVideos;
export { VIDEO_INDEX_FREQUENCY_HOURS };
