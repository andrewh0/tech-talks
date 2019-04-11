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
  // Prisma doesn't really support nested queries, so we need to use a gql fragment here.
  // https://www.prisma.io/docs/1.30/prisma-client/basic-data-access/reading-data-TYPESCRIPT-rsc3/#selecting-fields
  const talks = (await prisma
    .talks({
      where: {
        private: false
      },
      first: 10
    })
    .$fragment(
      `fragment TalkOrganizationNames on Talk {
          id
          viewCount
          description
          title
          duration
          source
          videoId
          thumbnailUrl
          publishedAt
          event {
            organization {
              id
              name
            }
          }
        }`
    )) as Array<{
    id: string;
    viewCount: number;
    description: string;
    title: string;
    duration: number;
    source: string;
    videoId: string;
    thumbnailUrl: string;
    publishedAt: number | null;
    event: { organization: { name: string; id: string } };
  }>;

  const mappedTalks = talks.map(talk => ({
    viewCount: talk.viewCount,
    description: talk.description,
    title: talk.title,
    duration: talk.duration,
    source: talk.source,
    videoId: talk.videoId,
    thumbnailUrl: talk.thumbnailUrl,
    publishedAt: talk.publishedAt ? new Date(talk.publishedAt).valueOf() : null,
    objectID: talk.id,
    organizationName: talk.event.organization.name,
    organizationId: talk.event.organization.id
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
