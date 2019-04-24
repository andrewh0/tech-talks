import { prisma, TalkUpdateInput } from '../prisma/generated/prisma-client';
import { google } from 'googleapis';
import { get } from 'lodash';

if (!process.env['YOUTUBE_API_KEY']) {
  throw 'Missing YouTube credentials.';
}

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

/*
Update the view counts and privacy status bit by bit to avoid slowness / memory issues.
This task will run every 10 minutes via Heroku Scheduler (~144 times / day).
*/

async function updateVideoAttributes() {
  const talks = await prisma.talks({
    first: 10,
    orderBy: 'updatedAt_ASC'
  });
  talks.forEach(async ({ id, videoId }) => {
    if (videoId) {
      try {
        const updateData = await getYouTubeVideoData(videoId);
        await updateTalkInDb(id, updateData);
      } catch (e) {
        console.log(
          `Could not update view count for videoId ${videoId} / talk id ${id}:`,
          e
        );
      }
    }
  });
}

/*
We need to stay below the daily YouTube API quota of 10,000 units.
https://developers.google.com/youtube/v3/docs/videos/list#part
*/
async function getYouTubeVideoData(
  videoId: string
): Promise<{ viewCount?: number; private: boolean }> {
  const res = await youtube.videos.list({
    part: 'statistics,status',
    id: videoId
  });
  const viewCount = get(res, ['data', 'items', '0', 'statistics', 'viewCount']);
  const privacyStatus =
    get(res, ['data', 'item', 'status', 'privacyStatus']) || false;
  if (viewCount !== undefined && viewCount !== null) {
    return {
      viewCount: parseInt(viewCount),
      private: privacyStatus !== 'public'
    };
  } else {
    return {
      private: privacyStatus !== 'public'
    };
  }
}

async function updateTalkInDb(id: string, updateData: TalkUpdateInput) {
  await prisma.updateTalk({
    data: updateData,
    where: {
      id
    }
  });
}

updateVideoAttributes();
