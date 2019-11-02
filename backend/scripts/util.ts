import { compact, get, merge, chunk, flatten } from 'lodash';
import * as moment from 'moment';
import { google } from 'googleapis';
import { Source } from '../firebaseUtil';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function getVideoDetails(videoIds: Array<string>) {
  const MAX_RESULTS = 50;
  const chunkedVideoIds = chunk(videoIds, MAX_RESULTS);
  const results = await Promise.all(
    chunkedVideoIds.map(async videoIdChunk => {
      const res = await youtube.videos.list({
        part: 'snippet,contentDetails,statistics,status',
        maxResults: MAX_RESULTS,
        id: videoIdChunk.join(',')
      });
      const data = res.data;
      const items = get(data, 'items') || [];
      return compact(
        items.map(item => {
          const description = get(item, ['snippet', 'description']);
          const duration = get(item, ['contentDetails', 'duration']);
          const privacyStatus = get(item, ['status', 'privacyStatus']);
          const publishedAt = get(item, ['snippet', 'publishedAt']);
          const thumbnailUrl = get(item, [
            'snippet',
            'thumbnails',
            'medium',
            'url'
          ]);
          const title = get(item, ['snippet', 'title']);
          const viewCount = get(item, ['statistics', 'viewCount']);
          const videoId = get(item, ['id']);

          if (
            !(
              duration &&
              privacyStatus &&
              publishedAt &&
              thumbnailUrl &&
              title &&
              viewCount &&
              videoId
            )
          ) {
            throw 'Could not get all required attributes from video.';
          }
          return {
            description,
            duration: moment.duration(duration).asSeconds(),
            private: privacyStatus !== 'public',
            hidden: false,
            publishedAt,
            thumbnailUrl,
            title,
            viewCount: parseInt(viewCount),
            source: Source.YOUTUBE,
            videoId
          };
        })
      );
    })
  );
  return flatten(results);
}

async function getPlaylistVideos(
  playlistId: string,
  nextPageToken: string | undefined = undefined,
  foundVideoIds: Array<string> = []
): Promise<Array<string>> {
  try {
    const res = await youtube.playlistItems.list(
      merge(
        {
          part: 'contentDetails',
          maxResults: 50,
          playlistId: playlistId
        },
        nextPageToken ? { pageToken: nextPageToken } : {}
      )
    );

    const data = res.data;
    const videoIds =
      (data.items &&
        data.items.map(item => {
          if (item && item.contentDetails) {
            return item.contentDetails.videoId;
          }
          console.log('No video id for item', item.id);
        })) ||
      [];

    if (
      data.pageInfo &&
      data.pageInfo.totalResults &&
      data.pageInfo.totalResults > 50 &&
      videoIds.length + foundVideoIds.length < data.pageInfo.totalResults
    ) {
      return await getPlaylistVideos(
        playlistId,
        get(data, ['nextPageToken']),
        compact(videoIds)
      );
    } else {
      return foundVideoIds.concat(compact(videoIds));
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getManyPlaylistVideos(playlists: Array<string>) {
  const result = await Promise.all(
    playlists.map(async playlist => {
      return await getPlaylistVideos(playlist);
    })
  );
  return flatten(result);
}

export { getVideoDetails, getPlaylistVideos, getManyPlaylistVideos };
