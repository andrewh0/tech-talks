const moment = require('moment');
const fetch = require('node-fetch');
const queryString = require('query-string');
const { get, chunk } = require('lodash');
const { YOUTUBE_API_KEY } = require('../../config/secrets');

const youtubeApiBase = 'https://www.googleapis.com/youtube/v3';
const endpoint = 'playlistItems';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function playlistIdFromUrl(url) {
  const result = get(queryString.parseUrl(url), ['query', 'list']);
  if (!result) {
    throw new Error(`No playlist id in url: ${url}`);
  }
  return result;
}

// https://developers.google.com/youtube/v3/docs/playlistItems/list
function videosFromPlaylistPage(playlistId, parts, pageToken) {
  const maxResults = 50;
  const queryParams = {
    playlistId,
    key: YOUTUBE_API_KEY,
    part: parts.join(','),
    maxResults,
    ...(pageToken ? { pageToken } : {})
  };
  const queryParamString = queryString.stringify(queryParams);
  return fetch(`${youtubeApiBase}/${endpoint}?${queryParamString}`)
    .then(response => response.json())
    .catch(error => {
      console.error(
        `Error fetching videos for playlist ${playlistId}`,
        `pageToken: ${pageToken || ''}`,
        error
      );
    });
}

// https://developers.google.com/youtube/v3/docs/videos/list
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
      console.error(`Error fetching video data from videoIds`, error);
    });
}

function chunkArrays(allVideoIds, size) {
  return chunk(allVideoIds, size);
}

async function videoMetadataForAllVideos(chunkedVideoIdLists, parts) {
  const list = await Promise.all(
    chunkedVideoIdLists.map(async chunkedVideoIdList => {
      const { items } = await videosFromIds(chunkedVideoIdList, parts);
      await sleep(500);
      return items;
    })
  );

  return list;
}

function normalizeYouTubeVideoList(items) {
  return items.map(item => ({
    videoId: get(item, ['id']),
    views: Number(get(item, ['statistics', 'viewCount'])),
    duration: moment
      .duration(get(item, ['contentDetails', 'duration']))
      .as('seconds')
  }));
}

async function allVideosFromPlaylist(playlistId, parts, metadata) {
  let result = [];
  let pageToken;
  do {
    const { items, nextPageToken } = await videosFromPlaylistPage(
      playlistId,
      parts,
      pageToken
    );
    const itemsWithMetadata = items.map(item => ({ ...item, metadata }));
    pageToken = nextPageToken;
    result = [...result, ...itemsWithMetadata];
    await sleep(500);
  } while (pageToken);
  return result;
}

function normalizeYouTubeVideos(videos) {
  return (
    videos
      .filter(video => get(video, ['status', 'privacyStatus']) === 'public')
      .filter(video => get(video, ['snippet', 'title']) !== 'Deleted video')
      // TODO filter out duplicate videos (playlists can have the same video listed > once)
      .map(normalizeYouTubeVideo)
  );
}

function formatDate(isoDateString) {
  const d = new Date(isoDateString);
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

function normalizeYouTubeVideo(video) {
  const { snippet, contentDetails, metadata } = video;
  const thumbnail = get(snippet, ['thumbnails', 'medium']);
  const thumbnailUrl = get(thumbnail, ['url']);
  const thumbnailHeight = get(thumbnail, ['height']);
  const thumbnailWidth = get(thumbnail, ['width']);
  return {
    title: get(snippet, ['title']),
    description: get(snippet, ['description']),
    source: 'youtube',
    videoId: get(contentDetails, 'videoId'),
    videoPublishedAt: formatDate(get(contentDetails, 'videoPublishedAt')),
    eventName: get(metadata, 'conference'),
    eventType: 'conference',
    eventLocation: get(metadata, 'location'),
    thumbnailUrl,
    thumbnailHeight,
    thumbnailWidth,
    year: Number(metadata.year)
  };
}

module.exports = {
  allVideosFromPlaylist,
  playlistIdFromUrl,
  normalizeYouTubeVideos,
  sleep,
  chunkArrays,
  videoMetadataForAllVideos,
  normalizeYouTubeVideoList
};
