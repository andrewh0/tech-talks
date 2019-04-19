import { compact, get, merge, chunk, flatten } from 'lodash';
import * as moment from 'moment';
import { google } from 'googleapis';

export enum Source {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO'
}

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
      return items.map(item => {
        const duration = get(item, ['contentDetails', 'duration']);
        const privacyStatus = get(item, ['status', 'privacyStatus']);
        const viewCount = get(item, ['statistics', 'viewCount']);
        return {
          description: get(item, ['snippet', 'description']),
          duration: duration
            ? moment.duration(duration).asSeconds()
            : undefined,
          private: privacyStatus !== 'public',
          hidden: false,
          publishedAt: get(item, ['snippet', 'publishedAt']),
          thumbnailUrl: get(item, ['snippet', 'thumbnails', 'medium', 'url']),
          title: get(item, ['snippet', 'title']) || '',
          viewCount: viewCount ? parseInt(viewCount) : undefined,
          source: Source.YOUTUBE,
          videoId: get(item, ['id'])
        };
      });
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

export { getVideoDetails, getPlaylistVideos };