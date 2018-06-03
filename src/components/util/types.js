// @flow

export type Video = {
  id: string,
  title: string,
  description: string,
  source: 'youtube' | 'vimeo',
  videoId: string,
  videoPublishedAt: string,
  year: number,
  eventName: string,
  eventType: string,
  eventLocation: string,
  views: number,
  duration: number,
  thumbnailUrl: string,
  thumbnailHeight: number,
  thumbnailWidth: number,
  obfuscatedId: string
};
