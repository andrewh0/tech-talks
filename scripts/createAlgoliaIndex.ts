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

async function createTalksAlgoliaIndex() {
  const talks = await prisma.talks({
    where: {
      private: false
    }
  });
  const mappedTalks = talks.map(talk => ({
    viewCount: talk.viewCount,
    description: talk.description,
    title: talk.title,
    duration: talk.duration,
    source: talk.source,
    videoId: talk.videoId,
    thumbnailUrl: talk.thumbnailUrl,
    publishedAt: talk.publishedAt ? new Date(talk.publishedAt).valueOf() : null,
    objectID: talk.id
  }));

  talksIndex.addObjects(mappedTalks, (err, _content) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Talks added!');
  });
}

createTalksAlgoliaIndex();
