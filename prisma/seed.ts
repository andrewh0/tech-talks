import { prisma } from './generated/prisma-client';
import * as data from '../data/all-data.json';

if (process.env.NODE_ENV === 'production') {
  throw `Don't do this in production!`;
}

type Data = Array<Org>;

type Org = {
  name: string;
  website: string;
  twitterHandle: string;
  events: Array<Event>;
};

type Event = {
  name: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  youtubePlaylist: string;
  talks: Array<Talk>;
};

enum Source {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO'
}

type Talk = {
  description: string;
  duration: number;
  private: boolean;
  hidden: boolean;
  publishedAt: string;
  thumbnailUrl: string;
  title: string;
  viewCount: number;
  source?: Source;
  videoId: string;
};

const d = data as Data;
async function main() {
  for (let org of d) {
    const events = org.events.map(event => {
      const talks = event.talks;
      return {
        ...event,
        talks: {
          create: talks
        }
      };
    });
    try {
      await prisma.createOrganization({
        ...org,
        events: {
          create: events
        }
      });
    } catch (e) {
      console.error(e, 'Could not create org', org.twitterHandle);
      continue;
    }
  }
}

main().catch(e => console.error(e));
