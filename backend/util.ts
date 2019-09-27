export type TalkResponse = {
  id: string;
  viewCount: number;
  description: string;
  title: string;
  duration: number;
  source: string;
  videoId: string;
  thumbnailUrl: string;
  publishedAt: string | null;
  event: { organization: { name: string; id: string } };
  private: boolean;
};

function responseToVideoHit(talk: TalkResponse) {
  return {
    viewCount: talk.viewCount,
    description: talk.description,
    title: talk.title,
    publishedAt: talk.publishedAt ? new Date(talk.publishedAt).valueOf() : null,
    objectID: talk.id,
    duration: talk.duration,
    source: talk.source,
    videoId: talk.videoId,
    thumbnailUrl: talk.thumbnailUrl,
    organizationName: talk.event.organization.name,
    organizationId: talk.event.organization.id
  };
}

export { responseToVideoHit };
