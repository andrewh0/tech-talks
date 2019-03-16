import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Location } from '@reach/router';
import styled from '@emotion/styled';

import theme from './theme';
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
  max-height: 100vh;
  min-height: 100vh;
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
            <VideoPage path="videos/:videoId" />
          </Router>
          <Location>
            {({ location }) => (
              <Player
                playerSize={playerSize}
                videoId={videoId}
                setPlayerSize={setPlayerSize}
                location={location}
              />
            )}
          </Location>
        </ContentContainer>
      </InstantSearchProvider>
    </ThemeProvider>
  );
}

export default App;
