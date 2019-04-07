import { prisma } from '../prisma/generated/prisma-client';
import { google } from 'googleapis';
import { get } from 'lodash';

if (!process.env['YOUTUBE_API_KEY']) {
  throw 'Missing YouTube credentials.';
}

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

async function updateViewCounts() {
  const talks = await prisma.talks();
  talks.forEach(async ({ id, videoId }) => {
    if (videoId) {
      try {
        const { viewCount } = await getYouTubeVideoCountData(videoId);
        if (viewCount) {
          await updateTalkViewCount(id, viewCount);
        }
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
We need to stay below the daily YouTube API quota of 10,000 units, so we
only update the view count here.
https://developers.google.com/youtube/v3/docs/videos/list#part
*/
async function getYouTubeVideoCountData(
  videoId: string
): Promise<{ viewCount: number | null }> {
  const res = await youtube.videos.list({
    part: 'statistics',
    id: videoId
  });
  const viewCount = get(res, ['data', 'items', '0', 'statistics', 'viewCount']);
  return { viewCount: viewCount ? parseInt(viewCount) : null };
}

async function updateTalkViewCount(id: string, viewCount: number) {
  await prisma.updateTalk({
    data: {
      viewCount
    },
    where: {
      id
    }
  });
}

updateViewCounts();
