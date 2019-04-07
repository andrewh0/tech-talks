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

updateAlgoliaIndex();
