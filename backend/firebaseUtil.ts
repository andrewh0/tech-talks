import admin from 'firebase-admin';
import * as cuid from 'cuid';

export enum Source {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO'
}

export enum EventKind {
  CONFERENCE = 'CONFERENCE',
  MEETUP = 'MEETUP'
}

export type FirebaseTalk = {
  createdAt: string;
  description: string;
  duration: number;
  eventId: string;
  hidden: boolean;
  id: string;
  private: boolean;
  publishedAt: string;
  source: Source;
  thumbnailUrl: string;
  title: string;
  updatedAt: string;
  videoId: string;
  viewCount: number;
};

export type FirebaseEvent = {
  city: string;
  country: string;
  createdAt: string;
  endDate: string;
  id: string;
  name: string;
  organizationId: string;
  startDate: string;
  talks: {
    [id: string]: boolean | null;
  };
  type: EventKind | null;
  updatedAt: string;
  youtubePlaylist?: string;
};

export type FirebaseOrganization = {
  createdAt: string;
  events: {
    [id: string]: boolean | null;
  };
  id: string;
  name: string;
  twitterHandle: string | null;
  updatedAt: string;
  website: string | null;
  youtubeChannel: string | null;
};

export type OrgOpts = {
  name: string;
  twitterHandle: string | null;
  website: string | null;
  youtubeChannel: string | null;
};

export type EventOpts = {
  city: string;
  country: string;
  endDate: string;
  name: string;
  organizationId: string;
  startDate: string;
  type: EventKind | null;
  youtubePlaylist?: string;
};

export type TalkOpts = {
  eventId: string;
  description: string;
  duration: number;
  private: boolean;
  hidden: boolean;
  publishedAt: string;
  thumbnailUrl: string;
  title: string;
  viewCount: number;
  source: Source;
  videoId: string;
};

if (
  !process.env['FIREBASE_PRIVATE_KEY'] ||
  !process.env['FIREBASE_CLIENT_EMAIL'] ||
  !process.env['FIREBASE_PROJECT_ID']
) {
  throw 'Missing Firebase credentials.';
}

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID
  })
});

let db = admin.firestore();

// Useful if used in conjunction with `const snapshot = await db.collection('some_collection').get()`
function listFirebaseDocs<T>(
  snapshot: FirebaseFirestore.QuerySnapshot
): Array<T> {
  const result: Array<T> = [];
  if (snapshot.empty) {
    console.log('No matching documents in snapshot.');
  } else {
    snapshot.forEach(doc => {
      result.push(doc.data() as T);
    });
  }
  return result;
}

function getFirebaseDoc<T>(doc: FirebaseFirestore.DocumentData): T | null {
  let result = null;
  if (!doc.exists) {
    console.log('No matching document found.');
  } else {
    result = doc.data() as T;
  }
  return result;
}

function createTimestamp() {
  return new Date().toISOString();
}

async function getFirebaseDocById<T>(
  docId: string,
  collectionName: string
): Promise<T> {
  const collectionDoc = await db
    .collection(collectionName)
    .doc(docId)
    .get();
  const doc = getFirebaseDoc<T>(collectionDoc);
  if (!doc) throw `No document with id ${docId} exists in ${collectionName}.`;
  return doc;
}

async function getOrgById(orgId: string): Promise<FirebaseOrganization> {
  return await getFirebaseDocById<FirebaseOrganization>(orgId, 'organizations');
}

async function getEventById(eventId: string): Promise<FirebaseEvent> {
  return await getFirebaseDocById<FirebaseEvent>(eventId, 'events');
}

async function getTalkById(orgId: string): Promise<FirebaseTalk> {
  return await getFirebaseDocById<FirebaseTalk>(orgId, 'talks');
}

async function createOrg(opts: OrgOpts): Promise<FirebaseOrganization> {
  const orgId = cuid();
  const now = createTimestamp();
  const newOrg: FirebaseOrganization = {
    ...opts,
    id: orgId,
    events: {},
    createdAt: now,
    updatedAt: now
  };
  await db
    .collection('organizations')
    .doc(orgId)
    .set(newOrg);
  return newOrg;
}

async function createEvent(opts: EventOpts): Promise<FirebaseEvent> {
  const eventId = cuid();
  const now = createTimestamp();
  const newEvent: FirebaseEvent = {
    ...opts,
    id: eventId,
    createdAt: now,
    updatedAt: now,
    talks: {}
  };
  await db
    .collection('events')
    .doc(eventId)
    .set(newEvent);
  await db
    .collection('organizations')
    .doc(opts.organizationId)
    .update({
      [`events.${eventId}`]: true,
      updatedAt: now
    });
  return newEvent;
}

async function createTalk(opts: TalkOpts): Promise<FirebaseTalk> {
  const talkId = cuid();
  const now = createTimestamp();
  const newTalk: FirebaseTalk = {
    ...opts,
    id: talkId,
    createdAt: now,
    updatedAt: now
  };
  await db
    .collection('talks')
    .doc(talkId)
    .set(newTalk);
  await db
    .collection('events')
    .doc(opts.eventId)
    .update({
      [`talks.${talkId}`]: true,
      updatedAt: now
    });
  return newTalk;
}

export {
  listFirebaseDocs,
  getFirebaseDoc,
  createTimestamp,
  getOrgById,
  getEventById,
  getTalkById,
  createOrg,
  createEvent,
  createTalk
};
export default db;
