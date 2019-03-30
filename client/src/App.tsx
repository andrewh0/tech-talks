import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Match } from '@reach/router';
import styled from '@emotion/styled';

import theme, { NAV_HEIGHT } from './theme';
import { Box } from './design';

import { InstantSearchProvider } from './Search';
import Nav from './Nav';
import Home from './Home';
import About from './About';
import VideoPage from './VideoPage';

import Player from './Player';

export type OnVideoCardClickType = (
  objectId: string,
  videoId: string,
  navigate: Function
) => void;

const ContentContainer = styled(Box)`
  position: relative;
  overflow: ${props => (props.playerSize === 'full' ? 'hidden' : 'auto')};
  max-height: calc(100vh - ${NAV_HEIGHT}px);
  min-height: calc(100vh - ${NAV_HEIGHT}px);
`;

function App() {
  const [videoId, setVideoId] = useState();
  const [playerSize, setPlayerSize] = useState('minimized');
  const handleVideoCardClick = (
    objectId: string,
    videoId: string,
    navigate: Function
  ) => {
    setVideoId(videoId);
    setPlayerSize('full');
    navigate(`/videos/${objectId}`);
  };
  const handleVideoPageLoad = async (objectId?: string): Promise<void> => {
    if (objectId) {
      let json = await fetch(`/api/talks/${objectId}`).then(r => r.json());
      if (json && json.videoId) {
        setVideoId(json.videoId);
        setPlayerSize('full');
      }
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <InstantSearchProvider>
        <Nav />
        <ContentContainer bg="darkGray" playerSize={playerSize}>
          <Router>
            <Home
              path="/"
              onVideoCardClick={handleVideoCardClick}
              setPlayerSize={setPlayerSize}
              videoId={videoId}
              playerSize={playerSize}
            />
            <About path="about" />
            <VideoPage
              path="videos/:objectId"
              onPageLoad={handleVideoPageLoad}
            />
          </Router>
          <Match path="/videos/:objectId">
            {({ match }) => (
              <Player
                playerSize={playerSize}
                videoId={videoId}
                setPlayerSize={setPlayerSize}
                match={match}
              />
            )}
          </Match>
        </ContentContainer>
      </InstantSearchProvider>
    </ThemeProvider>
  );
}

export default App;
