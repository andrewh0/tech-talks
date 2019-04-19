import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import { google } from 'googleapis';
import * as parse from 'url-parse';
import { groupBy, compact, get, omit, merge, chunk, flatten } from 'lodash';
import * as moment from 'moment';

/*
{
  name: 'React Native EU',
  city: 'Wroclaw',
  country: 'Poland',
  startDate: '2017-09-06',
  endDate: '2017-09-07',
  youtubePlaylist: 'https://www.youtube.com/watch?v=453oKJAqfy0&list=PLzUKC1ci01h_hkn7_KoFA-Au0DXLAQZR7'
}
*/

type EventFromCsvInput = {
  name: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  youtubePlaylist: string;
};

type OrgFromCsvInput = {
  name: string;
  twitterHandle: string;
  website: string;
};

enum Source {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO'
}

type TalkFromEvent = {
  description?: string;
  duration?: number;
  hidden?: boolean;
  private?: boolean;
  publishedAt?: string;
  source?: Source;
  title: string;
  thumbnailUrl?: string;
  videoId?: string;
  youtubePlaylist?: string;
};

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function jsonFromCsv(filePath: string): Promise<Array<any>> {
  const csvFilePath = path.join(__dirname, filePath);
  const json = await csv().fromFile(csvFilePath);
  return json;
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

async function getTalksFromEvents(
  eventsList: Array<EventFromCsvInput>
): Promise<Array<TalkFromEvent>> {
  let talks: Array<TalkFromEvent> = [];
  for (let event of eventsList) {
    const playlistId = parse(event.youtubePlaylist, true).query.list;
    if (!playlistId) {
      console.log(
        `No playlistId for ${event.name} ${event.startDate} ${
          event.youtubePlaylist
        }.`
      );
      continue;
    }
    const videoIdList = await getPlaylistVideos(playlistId);
    if (videoIdList.length === 0) {
      console.log(
        `No videos found for ${event.name}, playlist: ${playlistId}.`
      );
      continue;
    }
    const videos = await getVideoDetails(videoIdList);
    talks = talks.concat(
      videos.map(video => ({
        ...video,
        youtubePlaylist: event.youtubePlaylist
      }))
    );
  }
  return talks;
}

async function createSeedData(
  eventsFilePath: string,
  orgsFilePath: string,
  outputFilePath: string
) {
  const eventsList: Array<EventFromCsvInput> = await jsonFromCsv(
    eventsFilePath
  );
  const orgsList: Array<OrgFromCsvInput> = await jsonFromCsv(orgsFilePath);
  const talksList: Array<TalkFromEvent> = await getTalksFromEvents(eventsList);

  const groupedTalks = groupBy(talksList, 'youtubePlaylist');
  const eventsWithTalks = eventsList.map(event => ({
    ...event,
    talks: (groupedTalks[event.youtubePlaylist] || []).map(talk =>
      omit(talk, 'youtubePlaylist')
    )
  }));

  const groupedEvents = groupBy(eventsWithTalks, 'name');
  const orgsWithEvents = orgsList.map(org => ({
    ...org,
    events: groupedEvents[org.name]
  }));

  fs.writeFile(
    path.join(__dirname, outputFilePath),
    JSON.stringify(orgsWithEvents),
    'utf8',
    err => {
      if (err) {
        throw err;
      }
    }
  );
}

createSeedData(
  '../data/events-to-add.csv',
  '../data/orgs-to-add.csv',
  '../data/all-data.json'
);
