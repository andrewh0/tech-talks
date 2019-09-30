import * as algoliasearch from 'algoliasearch';
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID
  })
});

let db = admin.firestore();

if (!process.env['ALGOLIA_APP_ID'] || !process.env['ALGOLIA_API_KEY']) {
  throw 'Missing Algolia credentials.';
}

const client = algoliasearch(
  process.env['ALGOLIA_APP_ID'] || '',
  process.env['ALGOLIA_API_KEY'] || ''
);

const talksIndex = client.initIndex('TALKS');

function listFirebaseDocs(
  snapshot: FirebaseFirestore.QuerySnapshot
): Array<FirebaseFirestore.DocumentData> {
  const result: Array<FirebaseFirestore.DocumentData> = [];
  if (snapshot.empty) {
    console.log('No matching documents in snapshot.');
  } else {
    snapshot.forEach(doc => {
      result.push(doc.data());
    });
  }
  return result;
}

async function removePrivateTalks() {
  const talksSnapshot = await db
    .collection('talks')
    .where('private', '==', true)
    .get();
  const privateTalkIds = listFirebaseDocs(talksSnapshot).map(talk => talk.id);

  talksIndex.getObjects(
    privateTalkIds,
    (
      err,
      content: {
        results: Array<any | null>;
      }
    ) => {
      if (err) throw err;
      const objectIDsToDelete = content.results
        .filter((result: { objectID: string } | null) => !!result)
        .map((result: { objectID: string }) => result.objectID);
      if (objectIDsToDelete.length > 0) {
        console.log(
          'Removing the following objects from Algolia:',
          objectIDsToDelete
        );
        // The response is defined differently in the d.ts file, so we use `any` here.
        // It should be { objectIDs: Array<string>; taskID: number; }
        // See https://www.algolia.com/doc/api-reference/api-methods/delete-objects/?language=javascript#response
        talksIndex.deleteObjects(
          objectIDsToDelete,
          (err: any, response: any) => {
            if (err) throw err;
            console.log(
              `${response.objectIDs.length} item(s) removed from Algolia Index`
            );
          }
        );
      }
    }
  );
}

async function updateAlgoliaTalkViewCounts() {
  const talksSnapshot = await db
    .collection('talks')
    .where('private', '==', false)
    .get();
  const mappedTalks = listFirebaseDocs(talksSnapshot).map(talk => ({
    objectID: talk.id,
    viewCount: talk.viewCount
  }));
  talksIndex.partialUpdateObjects(mappedTalks, (err, _content) => {
    if (err) throw err;
    console.log('Algolia Index updated!');
  });
}

async function updateAlgoliaIndex() {
  await updateAlgoliaTalkViewCounts();
  await removePrivateTalks();
}
/*
Heroku's Scheduler can only be set to Daily / Hourly / 10 minutes.
We set the frequency to Daily and run this script roughly every other
day to reduce Algolia usage.
*/
if (new Date().getDate() % 2 === 1) {
  updateAlgoliaIndex();
}
