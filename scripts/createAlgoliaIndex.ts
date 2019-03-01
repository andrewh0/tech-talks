import * as algoliasearch from 'algoliasearch';
import { prisma } from '../prisma/generated/prisma-client';
import { omit } from 'lodash';

if (!process.env['ALGOLIA_APP_ID'] || !process.env['ALGOLIA_API_KEY']) {
  throw 'Missing Algolia credentials.';
}

const client = algoliasearch(
  process.env['ALGOLIA_APP_ID'] || '',
  process.env['ALGOLIA_API_KEY'] || ''
);

const talksIndex = client.initIndex('prod_TALKS');

async function createTalksAlgoliaIndex() {
  const talks = await prisma.talks({
    where: {
      private: false
    }
  });
  const mappedTalks = talks.map(talk => {
    const objectID = talk.id;
    return {
      ...omit(talk, 'id'),
      objectID
    };
  });

  talksIndex.addObjects(mappedTalks, (err, _content) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Talks added!');
  });
}

createTalksAlgoliaIndex();
