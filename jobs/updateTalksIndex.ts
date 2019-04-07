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
  const talks = await prisma.talks();
  const mappedTalks = talks.map(talk => ({
    objectID: talk.id,
    viewCount: talk.viewCount
  }));
  talksIndex.partialUpdateObjects(mappedTalks, (err, _content) => {
    if (err) throw err;
    console.log('Algolia Index updated!');
  });
}
/*
Heroku's Scheduler can only be set to Daily / Hourly / 10 minutes.
We set the frequency to Daily and run this script roughly every other
day to reduce Algolia usage.
*/
if (new Date().getDate() % 2 === 1) {
  updateAlgoliaIndex();
}
