import * as algoliasearch from 'algoliasearch';
import { prisma } from '../prisma/generated/prisma-client';

if (!process.env['ALGOLIA_APP_ID'] || !process.env['ALGOLIA_API_KEY']) {
  throw 'Missing Algolia credentials.';
}

const client = algoliasearch(
  process.env['ALGOLIA_APP_ID'] || '',
  process.env['ALGOLIA_API_KEY'] || ''
);

const talksIndex = client.initIndex('TALKS');

async function updateAlgoliaIndex() {
  const talks = await prisma.talks({
    where: {
      private: false
    }
  });
  const mappedTalks = talks.map(talk => ({
    objectID: talk.id,
    viewCount: talk.viewCount
  }));
  talksIndex.partialUpdateObjects(mappedTalks, (err, _content) => {
    if (err) throw err;
    console.log('Algolia Index updated!');
  });
  const privateTalks = await prisma.talks({
    where: {
      private: true
    }
  });
  const privateTalkIds = privateTalks.map(talk => talk.id);
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
/*
Heroku's Scheduler can only be set to Daily / Hourly / 10 minutes.
We set the frequency to Daily and run this script roughly every other
day to reduce Algolia usage.
*/
if (new Date().getDate() % 2 === 1) {
  updateAlgoliaIndex();
}
