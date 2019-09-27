import * as firebase from 'firebase/app';
import 'firebase/firestore';

export type FirebaseTalk = {
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

export type FirebaseEvent = {
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

export type FirebaseOrganization = {
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

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_CLIENT_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CLIENT_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
