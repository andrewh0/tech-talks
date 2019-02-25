import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { prisma } from './prisma/generated/prisma-client';

const app = express();

app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.disable('x-powered-by');

app.set('port', process.env.PORT || 3001);

app.get('/talks', async (req, res) => {
  const talks = await prisma.talks();
  res.json(talks);
});

app.get('/speakers', async (req, res) => {
  const speakers = await prisma.speakers();
  res.json(speakers);
});

app.get('/events', async (req, res) => {
  const events = await prisma.events();
  res.json(events);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(app.get('port'), () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
  }
});
