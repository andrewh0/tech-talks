import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';

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

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function useDebouncedWindowInnerHeight() {
  const [innerHeight, setInnerHeight] = useState(() => window.innerHeight);
  const debouncedSetInnerHeight = debounce(() => {
    setInnerHeight(window.innerHeight);
  }, 200);
  useEffect(() => {
    window.addEventListener('resize', debouncedSetInnerHeight);
    return () => {
      window.removeEventListener('resize', debouncedSetInnerHeight);
    };
  });
  return innerHeight;
}

export { usePrevious, useDebouncedWindowInnerHeight };
