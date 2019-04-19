import * as algoliasearch from 'algoliasearch';
import { prisma } from '../prisma/generated/prisma-client';
import { getVideoDetails } from './util';

/*
  - Add a single talk to the database and attach it to an existing event
  - Add the talk to the Algolia index
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

async function addTalkToExistingEvent(youtubeVideoId: string, eventId: string) {
  const existingTalks = await prisma.talks({
    where: {
      videoId: youtubeVideoId
    }
  });
  if (existingTalks.length > 0) {
    console.log('Talk(s) with that videoId already exist:', existingTalks);
    return;
  }
  const event = (await prisma.event({
    id: eventId
  }).$fragment(`
    fragment EventWithOrgs on Event {
      id
      organization {
        id
        name
      }
    }
  `)) as { id: string; organization: { id: string; name: string } } | null;

  if (!event) {
    console.log(`Event with id ${eventId} doesn't exist.`);
    return;
  }
  const organizationName = event.organization.name;
  const organizationId = event.organization.id;
  const videoDetails = await getVideoDetails([youtubeVideoId])[0];

  if (!videoDetails) {
    console.log(`Could not find details on video id: ${youtubeVideoId}.`);
    return;
  }
  const createdTalk = await prisma.createTalk({
    ...videoDetails,
    event: {
      connect: { id: eventId }
    }
  });

  talksIndex.addObject({
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
    organizationName,
    organizationId
  });
}

