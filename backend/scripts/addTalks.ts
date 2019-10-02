import * as algoliasearch from 'algoliasearch';
import { getVideoDetails } from './util';
import db, {
  FirebaseTalk,
  getFirebaseDoc,
  getOrgById,
  getEventById,
  createTalk
} from '../firebaseUtil';

/*
  - Add a list of talks to the database and attach them to an existing event
  - Add the list of talks to the Algolia index
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

async function addNewTalksToExistingEvent(
  youtubeVideoIds: Array<string>,
  eventId: string
) {
  const skippedTalks: Array<string> = [];

  const event = await getEventById(eventId);
  const org = await getOrgById(event.organizationId);

  youtubeVideoIds.forEach(async vId => {
    const talkDoc = await db
      .collection('talks')
      .where('videoId', '==', vId)
      .get();
    const talk = getFirebaseDoc<FirebaseTalk>(talkDoc);
    if (talk) {
      console.log(
        `Talk with videoId ${vId} exists in event with id ${
          talk.eventId
        }. Skipping.`
      );
      skippedTalks.push(talk.id);
      return;
    }
    const organizationName = org.name;
    const organizationId = org.id;
    const videoDetails = (await getVideoDetails([vId]))[0];
    if (!videoDetails) {
      console.log(`Could not find details on video id: ${vId}. Skipping.`);
      return;
    }

    const createdTalk = await createTalk({
      ...videoDetails,
      eventId
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
  });
  console.log(
    'Done. Skipped videoIds:',
    skippedTalks.length ? skippedTalks : 'none'
  );
}
