import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { prisma } from './prisma/generated/prisma-client';
import { responseToVideoHit, TalkResponse } from './util';

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.disable('x-powered-by');

app.set('port', process.env.PORT || 3001);
throw 'error';
app.get('/api/talks/:objectId', async (req, res) => {
  const talk = (await prisma.talk({ id: req.params.objectId }).$fragment(
    `fragment TalkOrganizationNames on Talk {
        id
        viewCount
        description
        title
        publishedAt
        duration
        source
        videoId
        private
        thumbnailUrl
        event {
          organization {
            id
            name
          }
        }
      }`
  )) as TalkResponse | null;
  if (talk && !talk.private) {
    res.json(responseToVideoHit(talk));
  } else {
    res.sendStatus(404);
  }
});

// app.get('/api/talks', async (req, res) => {
//   const talks = await prisma.talks();
//   res.json(talks);
// });

// app.get('/api/speakers', async (req, res) => {
//   const speakers = await prisma.speakers();
//   res.json(speakers);
// });

// app.get('/api/events', async (req, res) => {
//   const events = await prisma.events();
//   res.json(events);
// });

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
