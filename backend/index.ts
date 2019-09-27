import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';

import db from './firebaseDbClient';

import { responseToVideoHit } from './util';

type FirebaseTalk = {
  createdAt: string;
  description: string;
  duration: number;
  eventId: string;
  hidden: boolean;
  id: string;
  private: boolean;
  publishedAt: string;
  source: string;
  thumbnailUrl: string;
  title: string;
  updatedAt: string;
  videoId: string;
  viewCount: number;
};

type FirebaseEvent = {
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
  type: 'CONFERENCE' | 'MEETUP' | null;
  updatedAt: string;
  youtubePaylist: string;
};

type FirebaseOrganization = {
  events: {
    [id: string]: boolean | null;
  };
  id: string;
  name: string;
  twitterHandle: string;
  updatedAt: string;
  website: string;
  youtubeChannel: string | null;
};

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.disable('x-powered-by');

app.set('port', process.env.PORT || 3001);

app.get('/api/talks/:objectId', async (req, res) => {
  const talkObjectId = req.params.objectId;
  let talk = null;
  try {
    const talkDoc = await db
      .collection('talks')
      .doc(talkObjectId)
      .get();
    const talkData = talkDoc.data() as FirebaseTalk;
    if (talkData && talkDoc.exists) {
      const {
        eventId,
        updatedAt,
        createdAt,
        hidden,
        ...talkAttributes
      } = talkData;
      const eventDoc = await db
        .collection('events')
        .doc(eventId)
        .get();
      const eventData = eventDoc.exists && eventDoc.data();
      if (eventData) {
        const orgDoc = await db
          .collection('organizations')
          .doc(eventData.organizationId)
          .get();
        const orgData = orgDoc.exists && orgDoc.data();
        if (orgData) {
          talk = {
            ...talkAttributes,
            event: {
              organization: {
                id: orgData.id,
                name: orgData.name
              }
            }
          };
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  if (talk && !talk.private) {
    res.json(responseToVideoHit(talk));
  } else {
    res.sendStatus(404);
  }
});

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(app.get('port'), () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
  }
});
