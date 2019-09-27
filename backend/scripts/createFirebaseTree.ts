import admin from 'firebase-admin';
import { prisma } from '../prisma/generated/prisma-client';

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
});

let db = admin.firestore();

function arrToFirestoreObj(
  arr: Array<{ id: string }>
): {
  [name: string]: boolean;
} {
  let result: { [name: string]: boolean } = {};
  arr.forEach(item => {
    result[item.id] = true;
  });
  return result;
}

async function migrateOrganizations() {
  const orgFragment = `
    fragment OrganizationWithEvents on Organization {
      id
      website
      name
      updatedAt
      youtubeChannel
      twitterHandle
      events {
        id
      }
    }`;
  const orgs: [any] = await prisma.organizations().$fragment(orgFragment);
  const orgBatch = db.batch();

  orgs.forEach(org => {
    const orgRef = db.collection('organizations').doc(org.id);
    orgBatch.set(orgRef, {
      ...org,
      events: arrToFirestoreObj(org.events)
    });
  });

  return orgBatch.commit();
}

async function migrateEvents() {
  const eventFragment = `
    fragment EventWithTalks on Event {
      id
      city
      name
      updatedAt
      endDate
      country
      createdAt
      type
      startDate
      youtubePlaylist
      talks {
        id
      }
      organization {
        id
      }
    }
  `;
  const events: [any] = await prisma.events().$fragment(eventFragment);
  const eventBatch = db.batch();
  events.forEach(event => {
    const { talks, organization, ...eventProps } = event;
    const eventRef = db.collection('events').doc(event.id);
    eventBatch.set(eventRef, {
      ...eventProps,
      organizationId: event.organization.id,
      talks: arrToFirestoreObj(event.talks)
    });
  });

  return eventBatch.commit();
}

async function migrateTalks() {
  const talkFragment = `
    fragment TalkWithEvent on Talk {
      id
      duration
      updatedAt
      source
      viewCount
      private
      videoId
      description
      hidden
      createdAt
      title
      thumbnailUrl
      publishedAt
      event {
        id
      }
    }
  `;

  // Limit for a db.batch() is 500 objects
  const talksCount = await prisma
    .talksConnection()
    .aggregate()
    .count();
  const DB_BATCH_LIMIT = 500;
  let batches = Math.ceil(talksCount / DB_BATCH_LIMIT);

  for (let i = 0; i < batches; i++) {
    const talkBatch = db.batch();
    const talks: [any] = await prisma
      .talks({
        first: 500,
        skip: i * DB_BATCH_LIMIT
      })
      .$fragment(talkFragment);

    talks.forEach(talk => {
      const talkRef = db.collection('talks').doc(talk.id);
      const { event, ...talkProps } = talk;
      talkBatch.set(talkRef, {
        ...talkProps,
        eventId: talk.event.id
      });
    });
    await talkBatch.commit();
  }
}
