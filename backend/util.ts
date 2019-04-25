
export type TalkResponse = {
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
  private: boolean;
}

function responseToVideoHit(talk: TalkResponse) {
  return {
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
    organizationId: talk.event.organization.id,
    private: talk.private
  };
}

export { responseToVideoHit };
