import * as algoliasearch from 'algoliasearch';
import * as cuid from 'cuid';
import { getVideoDetails, getManyPlaylistVideos } from './util';
import db, {
  OrgOpts,
  FirebaseEvent,
  FirebaseTalk,
  getOrgById,
  createTimestamp,
  createOrg,
  FirebaseOrganization
} from '../firebaseUtil';

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
  city: string;
  country: string;
  endDate: string;
  name: string;
  organizationId?: string;
  startDate: string;
  type: 'CONFERENCE' | 'MEETUP';
};

async function createEventWithPlaylists(
  playlistIds: Array<string>,
  eventOpts: EventOpts,
  orgOpts?: OrgOpts
) {
  if (eventOpts.organizationId && orgOpts) {
    throw 'Invalid params. An org id and org opts were provided. Choose one or the other.';
  }
  const videoIds = await getManyPlaylistVideos(playlistIds);
  const talksToCreate = await getVideoDetails(videoIds);

  let org: FirebaseOrganization;
  if (eventOpts.organizationId) {
    org = await getOrgById(eventOpts.organizationId);
  } else if (orgOpts) {
    org = await createOrg(orgOpts);
  } else {
    throw 'Invalid params. Add an organization id or add organization params.';
  }

  const orgId = eventOpts.organizationId || org.id;
  const eventId = cuid();
  const now = createTimestamp();
  const newEvent: FirebaseEvent = {
    ...eventOpts,
    organizationId: orgId,
    createdAt: now,
    updatedAt: now,
    id: eventId,
    talks: {},
    youtubePlaylist: `https://www.youtube.com/playlist?list=${playlistIds[0]}`
  };
  await db
    .collection('events')
    .doc(eventId)
    .set(newEvent);

  const createdTalks: Array<FirebaseTalk> = [];

  const addTalksBatch = db.batch();
  talksToCreate.forEach(talkItem => {
    const talkId = cuid();
    const newTalk: FirebaseTalk = {
      ...talkItem,
      id: talkId,
      eventId: newEvent.id,
      createdAt: now,
      updatedAt: now
    };
    addTalksBatch.set(db.collection('talks').doc(talkId), newTalk);
    createdTalks.push(newTalk);
  });
  await addTalksBatch.commit();

  createdTalks.forEach(async createdTalk => {
    await db
      .collection('events')
      .doc(eventId)
      .update({
        [`talks.${createdTalk.id}`]: true
      });
  });

  await db
    .collection('organizations')
    .doc(orgId)
    .update({
      [`events.${eventId}`]: true,
      updatedAt: now
    });

  const algoliaTalks = createdTalks.map(createdTalk => ({
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
    organizationName: org.name,
    organizationId: orgId
  }));
  talksIndex.addObjects(algoliaTalks);
}

/*

Example:

createEventWithPlaylists([''], {
 ? organizationId: '',
  city: '',
  country: '',
  startDate: '',
  endDate: '',
  name: '',
  type: 'CONFERENCE'
},
 ? {
    name: '',
    twitterHandle: '',
    youtubeChannel: '',
    website: ''
  }
);
*/

