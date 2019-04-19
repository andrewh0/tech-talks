import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csvtojson';
import * as parse from 'url-parse';
import { groupBy, omit } from 'lodash';

import { getPlaylistVideos, getVideoDetails, Source } from './util';

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

async function jsonFromCsv(filePath: string): Promise<Array<any>> {
  const csvFilePath = path.join(__dirname, filePath);
  const json = await csv().fromFile(csvFilePath);
  return json;
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
