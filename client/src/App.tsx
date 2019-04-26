import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Match } from '@reach/router';
import styled from '@emotion/styled';
import { keyBy, sortBy, omit, map } from 'lodash';

import theme from './theme';
import { Box } from './design';
import { usePrevious } from './util';

import Nav from './Nav';
import Home from './Home';
import About from './About';
import VideoPage from './VideoPage';
import Player from './Player';
import CookieFooter from './CookieFooter';
import SavedPage from './SavedPage';
import { VideoHit } from './VideoCard';

export type PlayerState = 'hidden' | 'minimized' | 'full';

export type OnVideoSaveType = (talk: VideoHit, shouldSave: boolean) => void;

export type SavedTalksMapType = {
  [objectID: string]: SavedTalkType;
};

export type SavedTalkType = VideoHit & { order: number };

const ContentContainer = styled(Box)`
  position: relative;
`;

const LOCALSTORAGE_SAVED_TALKS_KEY = 'TT_SAVED_TALKS';

const CurrentVideoContext = React.createContext<
  [VideoHit | null, (video: VideoHit | null) => void] | null
>(null);

function useCurrentVideo() {
  const context = React.useContext(CurrentVideoContext);
  if (!context) {
    throw new Error(
      'useCurrentVideo must be used within a CurrentVideoProvider'
    );
  }
  const [video, setCurrentVideo] = context;
  const prevVideo = usePrevious(video);
  return {
    prevVideo,
    video,
    setCurrentVideo
  };
}

const PlayerContext = React.createContext<
  [PlayerState, (playerSize: PlayerState) => void] | null
>(null);

function CurrentVideoProvider(props: any) {
  const [video, setCurrentVideo] = React.useState<VideoHit | null>(null);
  const value = React.useMemo(() => [video, setCurrentVideo], [video])
  return <CurrentVideoContext.Provider {...props} value={value} />;
}

function PlayerContextProvider(props: any) {
  const [playerSize, setPlayerSize] = useState<PlayerState>('hidden');
  const value = React.useMemo(() => [playerSize, setPlayerSize], [playerSize]);
  return <PlayerContext.Provider {...props} value={value} />;
}

function usePlayerState() {
  const context = React.useContext(PlayerContext);
  if (!context) {
    throw new Error(
      'usePlayerState must be used within a PlayerContextProvider'
    );
  }
  return context;
}

function App() {
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
  return (
    <ThemeProvider theme={theme}>
      <Nav />
      <ContentContainer bg="darkGray">
        <CurrentVideoProvider>
          <PlayerContextProvider>
            <Router>
              <Home
                path="/"
                onVideoSave={handleSetSavedTalk}
                savedTalks={savedTalks}
              />
              <About path="about" />
              <SavedPage
                path="saved"
                onVideoSave={handleSetSavedTalk}
                savedTalks={savedTalks}
              />
              <VideoPage
                path="talks/:objectId"
              />
            </Router>
            <Match path="/talks/:objectId">
              {({ navigate, match }) => (
                <Player
                  match={match}
                  navigate={navigate}
                />
              )}
            </Match>
          </PlayerContextProvider>
        </CurrentVideoProvider>
      </ContentContainer>
      <CookieFooter />
    </ThemeProvider>
  );
}

export { LOCALSTORAGE_SAVED_TALKS_KEY, useCurrentVideo, usePlayerState };
export default App;
