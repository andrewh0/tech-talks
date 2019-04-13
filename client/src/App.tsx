import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Match } from '@reach/router';
import styled from '@emotion/styled';

import theme, { NAV_HEIGHT } from './theme';
import { Box } from './design';

import InstantSearchProvider from './SearchProvider';
import Nav from './Nav';
import Home from './Home';
import About from './About';
import VideoPage from './VideoPage';
import Player from './Player';

export type OnVideoCardClickType = (
  objectId: string,
  videoId: string,
  navigate: (path: string) => void
) => void;

const ContentContainer = styled(Box)`
  position: relative;
  max-height: calc(100vh - ${NAV_HEIGHT}px);
  min-height: calc(100vh - ${NAV_HEIGHT}px);
`;

function App() {
  const [videoId, setVideoId] = useState();
  const [videoObjectId, setVideoObjectId] = useState();
  const [playerSize, setPlayerSize] = useState('hidden');
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
            />
            <About path="about" />
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
      </InstantSearchProvider>
    </ThemeProvider>
  );
}

export default App;
