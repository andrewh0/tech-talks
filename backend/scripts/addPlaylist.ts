import * as algoliasearch from 'algoliasearch';
import { prisma } from '../prisma/generated/prisma-client';
import { getVideoDetails, getManyPlaylistVideos } from './util';
import { EventType } from '../prisma/generated/prisma-client/index';

/*
  - Given an organization, create an event and all associated talks from a YouTube playlist
  - Add all talks to the Algolia index
*/

if (!process.env['ALGOLIA_APP_ID'] || !process.env['ALGOLIA_API_KEY']) {
  throw 'Missing Algolia credentials.';
}

if (!process.env['YOUTUBE_API_KEY']) {
  throw 'Missing YouTube credentials.';
}

const client = algoliasearch(
  process.env['ALGOLIA_APP_ID'] || '',
  process.env['ALGOLIA_API_KEY'] || ''
);

const talksIndex = client.initIndex('TALKS');

type EventOpts = {
  organizationId: string;
  city?: string;
  country?: string;
  endDate?: string; // YYYY-MM-DD
  name?: string;
  startDate?: string; // YYYY-MM-DD
  type?: EventType;
};

async function createEventWithPlaylists(
  playlistIds: Array<string>,
  eventOpts: EventOpts
) {
  const videoIds = await getManyPlaylistVideos(playlistIds);
  const talksToCreate = await getVideoDetails(videoIds);
  const createdEvent = (await prisma.createEvent({
    organization: {
      connect: { id: eventOpts.organizationId }
    },
    talks: {
      create: talksToCreate
    },
    city: eventOpts.city,
    country: eventOpts.country,
    endDate: eventOpts.endDate,
    name: eventOpts.name,
    startDate: eventOpts.startDate,
    type: eventOpts.type,
    youtubePlaylist: `https://www.youtube.com/playlist?list=${playlistIds[0]}`
  }).$fragment(`
      fragment EventWithTalks on Event {
        id
        talks {
          viewCount
          description
          title
          duration
          source
          videoId
          thumbnailUrl
          publishedAt
          id
        }
        organization {
          name
        }
      }
    `)) as {
    id: string;
    talks: Array<{
      viewCount: number;
      description: string;
      title: string;
      duration: number;
      source: string;
      videoId: string;
      thumbnailUrl: string;
      publishedAt: number | null;
      id: string;
    }>;
    organization: {
      name: string;
    };
  };

  const algoliaTalks = createdEvent.talks.map(createdTalk => ({
    viewCount: createdTalk.viewCount,
    description: createdTalk.description,
    title: createdTalk.title,
    duration: createdTalk.duration,
    source: createdTalk.source,
    videoId: createdTalk.videoId,
    thumbnailUrl: createdTalk.thumbnailUrl,
    publishedAt: createdTalk.publishedAt
      ? new Date(createdTalk.publishedAt).valueOf()
      : null,
    objectID: createdTalk.id,
    organizationName: createdEvent.organization.name,
    organizationId: eventOpts.organizationId
  }));
  talksIndex.addObjects(algoliaTalks);
}

/*

Example:

createEventWithPlaylists(['PLVSuvWb4Q2Y7oxwvpzlwFxAO6IbIjMDgB'], {
  organizationId: 'cjuohnicl071y0792wik0hztn',
  city: 'Helsinki',
  country: 'Finland',
  endDate: '2018-10-19',
  name: 'GraphQL Finland',
  startDate: '2018-10-19',
  type: 'CONFERENCE'
});

*/
