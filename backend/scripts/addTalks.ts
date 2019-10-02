import * as algoliasearch from 'algoliasearch';
import * as cuid from 'cuid';
import { getVideoDetails } from './util';
import db, {
  FirebaseTalk,
  getFirebaseDoc,
  createTimestamp,
  getOrgById,
  getEventById
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
  /*
    Let skippedTalks

    if event doesn't exist, return
    otherwise, fetch the org name and store it

    For each video id in youtubeVideoIds, check its existence in talks collection
      if doesn't exist
        create new talk document
        attach it to the event document
        add it to algolia

    console.log(skipped talks)

  */

  const skippedTalks: Array<string> = [];

  const event = await getEventById(eventId);
  const org = await getOrgById(event.organizationId);

  youtubeVideoIds.forEach(async vId => {
    const talkDoc = await db
      .collection('talks')
      .where('videoId', '==', vId)
      .get();
    const talk = getFirebaseDoc<FirebaseTalk>(talkDoc);
    if (!!talk) {
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
      skippedTalks.push(talk.id);
      return;
    }
    const talkId = cuid();
    const now = createTimestamp();

    const createdTalk: FirebaseTalk = {
      ...videoDetails,
      eventId: eventId,
      updatedAt: now,
      createdAt: now,
      id: talkId
    };

    await db
      .collection('talks')
      .doc(talkId)
      .set(createdTalk);
    console.log(createdTalk);

    // await db.collection('events').doc(eventId).update({
    //   [`talks.${talkId}`]: true,
    //   updatedAt: now
    // });

    // talksIndex.addObject({
    //   viewCount: createdTalk.viewCount,
    //   description: createdTalk.description,
    //   title: createdTalk.title,
    //   duration: createdTalk.duration,
    //   source: createdTalk.source,
    //   videoId: createdTalk.videoId,
    //   thumbnailUrl: createdTalk.thumbnailUrl,
    //   publishedAt: createdTalk.publishedAt
    //     ? new Date(createdTalk.publishedAt).valueOf()
    //     : null,
    //   objectID: createdTalk.id,
    //   organizationName,
    //   organizationId
    // });
  });
  console.log('Done. Skipped videoIds:', skippedTalks);

  // const allTalksSnapshot
  // const existingTalks = await prisma.talks({
  //   where: {
  //     videoId: youtubeVideoId
  //   }
  // });
  // if (existingTalks.length > 0) {
  //   console.log('Talk(s) with that videoId already exist:', existingTalks);
  //   return;
  // }
  // const event = (await prisma.event({
  //   id: eventId
  // }).$fragment(`
  //   fragment EventWithOrgs on Event {
  //     id
  //     organization {
  //       id
  //       name
  //     }
  //   }
  // `)) as { id: string; organization: { id: string; name: string } } | null;

  // if (!event) {
  //   console.log(`Event with id ${eventId} doesn't exist.`);
  //   return;
  // }
  // const organizationName = event.organization.name;
  // const organizationId = event.organization.id;
  // const videoDetails = (await getVideoDetails([youtubeVideoId]))[0];

  // if (!videoDetails) {
  //   console.log(`Could not find details on video id: ${youtubeVideoId}.`);
  //   return;
  // }
  // const createdTalk = await prisma.createTalk({
  //   ...videoDetails,
  //   event: {
  //     connect: { id: eventId }
  //   }

  //   // ... createdAt
  //   // ... updatedAt
  // });

  // talksIndex.addObject({
  //   viewCount: createdTalk.viewCount,
  //   description: createdTalk.description,
  //   title: createdTalk.title,
  //   duration: createdTalk.duration,
  //   source: createdTalk.source,
  //   videoId: createdTalk.videoId,
  //   thumbnailUrl: createdTalk.thumbnailUrl,
  //   publishedAt: createdTalk.publishedAt
  //     ? new Date(createdTalk.publishedAt).valueOf()
  //     : null,
  //   objectID: createdTalk.id,
  //   organizationName,
  //   organizationId
  // });
}

// addNewTalksToExistingEvent()
