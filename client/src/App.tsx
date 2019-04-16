import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Match } from '@reach/router';
import styled from '@emotion/styled';
import { keyBy, sortBy, omit, map } from 'lodash';

import theme from './theme';
import { Box } from './design';

import InstantSearchProvider from './SearchProvider';
import Nav from './Nav';
import Home from './Home';
import About from './About';
import VideoPage from './VideoPage';
import Player from './Player';
import CookieFooter from './CookieFooter';
import SavedPage from './SavedPage';
import { VideoHit } from './VideoCard';

export type OnVideoCardClickType = (
  objectId: string,
  videoId: string,
  navigate: (path: string) => void
) => void;

export type OnVideoSaveType = (talk: VideoHit, shouldSave: boolean) => void;

export type SetPlayerSizeType = (size: string) => void;

const ContentContainer = styled(Box)`
  position: relative;
`;

const LOCALSTORAGE_SAVED_TALKS_KEY = 'TT_SAVED_TALKS';

export type SavedTalksMapType = {
  [objectID: string]: SavedTalkType;
};

export type SavedTalkType = VideoHit & { order: number };

function App() {
  const [videoId, setVideoId] = useState();
  const [videoObjectId, setVideoObjectId] = useState();
  const [playerSize, setPlayerSize] = useState('hidden');
  const savedTalksInitial = () =>
    keyBy(
      JSON.parse(
        window.localStorage.getItem(LOCALSTORAGE_SAVED_TALKS_KEY) ||
          JSON.stringify([])
      ).map((item: VideoHit, i: number) => ({ ...item, order: i })),
      'objectID'
    );
  const [savedTalks, setSavedTalks] = useState(savedTalksInitial);
  useEffect(() => {
    const savedTalksList = sortBy(savedTalks, [o => o.order]).map(talk =>
      omit(talk, ['order'])
    );
    window.localStorage.setItem(
      LOCALSTORAGE_SAVED_TALKS_KEY,
      JSON.stringify(savedTalksList)
    );
  }, [savedTalks]);
  const handleSetSavedTalk = (talk: VideoHit, shouldSave: boolean) => {
    if (shouldSave) {
      if (savedTalks[talk.objectID]) {
        return;
      }
      const savedTalksList = map(savedTalks, t => t);
      setSavedTalks({
        ...savedTalks,
        [talk.objectID]: {
          ...talk,
          order: savedTalksList.length
        }
      });
    } else {
      if (!savedTalks[talk.objectID]) {
        return;
      }
      setSavedTalks(omit(savedTalks, talk.objectID));
    }
  };
  const setVideo = (videoObjectId: string | null, videoId: string | null) => {
    setVideoId(videoId);
    setVideoObjectId(videoObjectId);
  };
  const handleVideoCardClick = (
    objectId: string,
    videoId: string,
    navigate: (path: string) => void
  ) => {
    setVideo(objectId, videoId);
    setPlayerSize('full');
    navigate(`/talks/${objectId}`);
  };
  const handleVideoPageLoad = async (objectId?: string): Promise<void> => {
    if (objectId) {
      let json = await fetch(`/api/talks/${objectId}`).then(r => r.json());
      if (json && json.videoId) {
        setVideo(objectId, json.videoId);
        setPlayerSize('full');
      }
    }
  };
  const handleVideoClose = () => {
    setVideo(null, null);
    setPlayerSize('hidden');
  };
  const handleVideoExpand = (navigate: (path: string) => void) => {
    setPlayerSize('full');
    navigate(`/talks/${videoObjectId}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <InstantSearchProvider>
        <Nav />
        <ContentContainer bg="darkGray">
          {/*
            Reach Router manages focus and scroll position, so scroll position is not always in the intended place.
            Setting primary={false} is a workaround, but unfortunately removes a lot of the accessibility features.
            https://github.com/reach/router/issues/198
          */}
          <Router primary={false}>
            <Home
              path="/"
              onVideoCardClick={handleVideoCardClick}
              setPlayerSize={setPlayerSize}
              videoId={videoId}
              playerSize={playerSize}
              onVideoSave={handleSetSavedTalk}
              savedTalks={savedTalks}
            />
            <About path="about" />
            <SavedPage
              path="saved"
              onVideoCardClick={handleVideoCardClick}
              onVideoSave={handleSetSavedTalk}
              playerSize={playerSize}
              savedTalks={savedTalks}
            />
            <VideoPage
              path="talks/:objectId"
              onPageLoad={handleVideoPageLoad}
            />
          </Router>
          <Match path="/talks/:objectId">
            {({ navigate, match }) => (
              <Player
                onVideoClose={handleVideoClose}
                onVideoExpand={handleVideoExpand}
                playerSize={playerSize}
                videoId={videoId}
                setPlayerSize={setPlayerSize}
                match={match}
                navigate={navigate}
              />
            )}
          </Match>
        </ContentContainer>
        <CookieFooter />
      </InstantSearchProvider>
    </ThemeProvider>
  );
}

export { LOCALSTORAGE_SAVED_TALKS_KEY };
export default App;
