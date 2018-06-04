const csv = require('csvtojson');
const fs = require('fs');
const {
  allVideosFromPlaylist,
  playlistIdFromUrl,
  normalizeYouTubeVideos,
  videoMetadataForAllVideos,
  chunkArrays,
  normalizeYouTubeVideoList
} = require('./videosFromPlaylists');
const { flatten, zipWith } = require('lodash');

function parseCsv(inputCsvFilePath) {
  return new Promise((resolve, reject) => {
    const result = [];
    csv()
      .fromFile(inputCsvFilePath)
      .on('json', (jsonObj, _rowIndex) => {
        result.push(jsonObj);
      })
      .on('end', () => {
        resolve(result);
      })
      .on('error', error => {
        reject(error);
      });
  });
}

function writeJsonFile(jsonInput, outputJsonFilePath) {
  fs.writeFile(outputJsonFilePath, JSON.stringify(jsonInput), 'utf8', error => {
    if (error) {
      throw new Error(error);
    }
  });
}

async function csvToJson(inputCsvFilePath, outputJsonFilePath) {
  /*
    The YouTube API doesn't give us all the video data when using the playlist
    endpoint, so 1) get all the videos from each playlist and 2) look up those
    videos to get more detailed data.
  */

  try {
    const playlists = await parseCsv(inputCsvFilePath);
    const playlistVideoList = await Promise.all(
      playlists.map(({ playlist, ...metadata }) =>
        allVideosFromPlaylist(
          playlistIdFromUrl(playlist),
          ['snippet', 'contentDetails', 'status'],
          metadata
        )
      )
    ).then(nestedVideoList => normalizeYouTubeVideos(flatten(nestedVideoList)));

    const videosWithMetadata = await videoMetadataForAllVideos(
      chunkArrays(playlistVideoList.map(({ videoId }) => videoId), 50),
      ['contentDetails', 'statistics']
    ).then(nestedVideosWithMetadata =>
      flatten(
        nestedVideosWithMetadata.map(data => normalizeYouTubeVideoList(data))
      )
    );

    // Zip the two lists together
    const zipped = zipWith(
      playlistVideoList,
      videosWithMetadata,
      (b, { videoId, views, duration }) => {
        if (b.videoId !== videoId) {
          throw new Error(
            `Video IDs do not match: ${b.videoId} and ${videoId}`
          );
        }
        return {
          ...b,
          views,
          duration
        };
      }
    );
    return writeJsonFile(zipped, outputJsonFilePath);
  } catch (error) {
    throw new Error(error);
  }
}

function findDiff(newData, mostData) {
  const a = new Set(mostData.map(({ videoId }) => videoId));

  const b = newData.filter(({ videoId }) => !a.has(videoId));
  return b;
}

// TODO remove duplicates
// TODO remove anything over like 3 hours
// TODO remove anything less than 3 minutes

// Use project path, not the relative path
csvToJson('ignored/techtalksredo.csv', 'data.json');
